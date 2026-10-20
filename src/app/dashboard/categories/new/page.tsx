'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/utils/api';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'ACTIVE',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (fieldErrors.image) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated.image;
        return updated;
      });
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const scrollToFirstError = (errors: Record<string, string>) => {
    const fieldOrder = ['name', 'image'];
    const firstInvalid = fieldOrder.find(f => errors[f]) || Object.keys(errors)[0];
    if (firstInvalid) {
      const container = document.getElementById(`field-${firstInvalid}`);
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const focusable = container.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
        if (focusable) {
          setTimeout(() => focusable.focus(), 200);
        }
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || !formData.name.trim()) {
      errors.name = 'Category name is required';
    }

    if (!imageFile) {
      errors.image = 'Category image is required';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      scrollToFirstError(errors);
      return false; // Do not call backend
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return; // Stop immediately, do not call backend
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value as string);
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await api.post('/categories/create-category', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Category created successfully!');
      router.push('/dashboard/categories');
    } catch (err: any) {
      const serverErrors: Record<string, string> = {};
      const backendErrors = err.response?.data?.errors || err.response?.data?.data;
      if (Array.isArray(backendErrors)) {
        backendErrors.forEach((item: any) => {
          let fieldKey = item.field || '';
          if (fieldKey.startsWith('body.')) {
            fieldKey = fieldKey.replace('body.', '');
          }
          if (fieldKey) {
            serverErrors[fieldKey] = item.message;
          }
        });
        setFieldErrors(prev => ({ ...prev, ...serverErrors }));
        scrollToFirstError(serverErrors);
      } else {
        const errMsg = err.response?.data?.message || err.message || 'Failed to create category';
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/dashboard/categories" className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">Add Category</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link 
            href="/dashboard/categories"
            className="px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" /> Discard
          </Link>
          <button 
            type="submit" 
            disabled={loading}
            className="px-3.5 sm:px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#5022C3] hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-70"
          >
            <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6">
        <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-6">

          <Card title="General Information">
            <div className="space-y-6">
              <div id="field-name">
                <Input 
                  label="Category Name" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.g. Smartphones, Laptops"
                  error={fieldErrors.name}
                  required
                />
              </div>
              
              <Textarea 
                label="Description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
              />
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div id="field-image">
              <Card title="Category Image">
                <ImageUpload 
                  previewUrl={previewUrl}
                  onChange={handleImageChange}
                  error={fieldErrors.image}
                />
              </Card>
            </div>

            <Card title="Settings">
              <Select 
                label="Category Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { label: 'ACTIVE', value: 'ACTIVE' },
                  { label: 'INACTIVE', value: 'INACTIVE' },
                  { label: 'DRAFT', value: 'DRAFT' },
                ]}
              />
            </Card>
          </div>

        </div>
      </div>
    </form>
  );
}

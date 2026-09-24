import { CheckCircle2, ShieldCheck, Zap, Repeat } from 'lucide-react';

const features = [
  {
    name: 'Courier Automation',
    description: 'Automate your shipping and fulfillment processes seamlessly with top logistics providers.',
    icon: Zap,
  },
  {
    name: 'Advanced Fraud Check',
    description: 'Protect your store with advanced fraud detection for your orders.',
    icon: ShieldCheck,
  },
  {
    name: 'Abandoned Checkout Recovery',
    description: 'Capture and recover abandoned checkout leads to increase sales effectively.',
    icon: Repeat,
  },
  {
    name: 'SMS Notifications & Marketing',
    description: 'Send automated SMS updates to your customers and utilize powerful email marketing tools.',
    icon: CheckCircle2,
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 lg:py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-semibold text-[hsl(var(--accent-primary))] tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-xl sm:text-3xl lg:text-4xl leading-8 font-extrabold tracking-tight text-gray-900">
            Everything you need to succeed online
          </p>
          <p className="mt-4 max-w-2xl text-base sm:text-xl text-gray-500 mx-auto">
            MASH ECO provides all the tools required to build, manage, and scale your online business effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {features.map((feature) => (
            <div key={feature.name} className="bg-white rounded-2xl p-5 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-3 md:gap-6">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-[hsl(var(--accent-primary))]/10 text-[hsl(var(--accent-primary))]">
                <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-gray-500 text-sm sm:text-base">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

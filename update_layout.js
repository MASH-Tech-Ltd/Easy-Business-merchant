const fs = require('fs');
const filePath = 'src/app/dashboard/layout.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

if (!content.includes('isAccountFrozen')) {
  content = content.replace('const [merchantUser, setMerchantUser] = useState<any>(null);', 'const [merchantUser, setMerchantUser] = useState<any>(null);\n  const [isAccountFrozen, setIsAccountFrozen] = useState(false);');
  
  content = content.replace('const fetchSubscription = async () => {', 'const fetchSubscription = async () => {\n        try { const res = await api.get("/tenants/my-store"); if(res.data?.data?.status === "suspended") setIsAccountFrozen(true); } catch(e){}');
  
  content = content.replace("socket.on('refresh_subscriptions', () => {", "socket.on('account_status_changed', async () => {\n          try {\n            const res = await api.get('/tenants/my-store');\n            if(res.data?.data?.status === 'suspended') {\n              setIsAccountFrozen(true);\n            } else {\n              setIsAccountFrozen(false);\n            }\n          } catch(e){}\n        });\n\n        socket.on('refresh_subscriptions', () => {");
  
  content = content.replace("socket.off('refresh_subscriptions');", "socket.off('account_status_changed');\n          socket.off('refresh_subscriptions');");
  
  content = content.replace('{/* Main Content */}', '{/* Main Content */}\n      {isAccountFrozen && (\n        <div className="fixed inset-0 z-[100] bg-white bg-opacity-95 flex flex-col items-center justify-center backdrop-blur-sm">\n          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />\n          <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Suspended</h1>\n          <p className="text-gray-500 text-center max-w-md mb-6">Your merchant account has been suspended by the administration. You have restricted access to the dashboard. Please contact support.</p>\n          <button onClick={() => { sessionStorage.removeItem("merchantUser"); window.location.href="/login"; }} className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700">Logout</button>\n        </div>\n      )}');
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated layout');
}

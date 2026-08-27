const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://htwawaptwqnfniuzuqff.supabase.co', 'sb_publishable_Q19paODg9WPNKostR0uSyA_kWT12Rrf');
async function run() {
  const { data: settings } = await supabase.from('settings').select('*');
  const { data: experience } = await supabase.from('experience').select('*');
  const { data: services } = await supabase.from('services').select('*');
  const { data: faqs } = await supabase.from('faqs').select('*');
  console.log('Settings:', settings);
  console.log('Experience:', experience);
  console.log('Services:', services);
  console.log('FAQs:', faqs);
}
run();

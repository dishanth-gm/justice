const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('password123', salt);

console.log('Valid Hash:', hash);

fetch("https://htwawaptwqnfniuzuqff.supabase.co/rest/v1/users?email=eq.hruwhn@gmail.com", {
  method: "PATCH",
  headers: {
    "apikey": "sb_publishable_Q19paODg9WPNKostR0uSyA_kWT12Rrf",
    "Authorization": "Bearer sb_publishable_Q19paODg9WPNKostR0uSyA_kWT12Rrf",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ password: hash })
}).then(res => console.log('Update Status:', res.status));

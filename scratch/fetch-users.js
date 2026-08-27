fetch("https://htwawaptwqnfniuzuqff.supabase.co/rest/v1/users?select=*", {
  headers: {
    "apikey": "sb_publishable_Q19paODg9WPNKostR0uSyA_kWT12Rrf",
    "Authorization": "Bearer sb_publishable_Q19paODg9WPNKostR0uSyA_kWT12Rrf"
  }
}).then(res => res.json()).then(data => console.log(data));

const http = require('http');
http.get('http://localhost:8080/api/ailments', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    json.forEach(a => console.log(a.id + ' - ' + a.name));
  });
});

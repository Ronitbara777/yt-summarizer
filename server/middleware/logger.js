const logger=(req,res,next)=>{
  const method=req.method;
  const url=req.url;
  const time=new Date().toISOString();

  let color = "\x1b[37m"; 
  if (method === "GET") color = "\x1b[32m";
  else if (method === "POST") color = "\x1b[33m"; 
  else if (method === "DELETE") color = "\x1b[31m"; 
  console.log(`${color}[${time}] ${method} ${url}\x1b[0m`);
  
  next(); 
};
export default logger;
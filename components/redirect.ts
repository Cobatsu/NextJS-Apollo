import cookie from 'cookie'

const clearCookie = (res, name) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(name,"", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    })
  );
};


const redirect = (res: any, target: string) => {

  if (res) {
    if(target == '/login') { clearCookie(res,'token');} 
    res.writeHead(303, { Location: target });
    res.end();
  } 

};

export default redirect;
  
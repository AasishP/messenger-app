//This is input validation schemas for username,password,firstName and lastName.

const usernameSchema = /[A-Za-z0-9._]{4,255}$/;
/* anything in range [A-Z] [a-z] [0-9] _ and should have
    length {min,max}{4,128}
*/
const passwordSchema = /[\S]{6,255}$/;
/* [\S] means anything except whitespace characters and
    should have length {min,max}{6,128}
*/
const firstNameSchema = /[A-Za-z]{3,255}$/;
/* only alpha characters and should have 
    length {min,max}{3,255}
*/
const lastNameSchema = /[A-Za-z]{3,255}$/;
/* only alpha characters and should have length 
    {min,max}{3,255}
*/
module.exports = {
  usernameSchema,
  passwordSchema,
  firstNameSchema,
  lastNameSchema,
};

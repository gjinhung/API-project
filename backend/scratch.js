npx sequelize model:generate --name Booking --attributes spotld:integer,userld:integer,startDate:date,endDate:date,createdAt:date,updatedAt:date

npx sequelize model:generate --name Review --attributes userld:integer,spotld:integer,review:string,stars:integer,createdAt:date,updatedAt:date

npx sequelize model:generate --name Spot --attributes ownerld:integer,address:string,city:string,state:string,country:string,lat:integer,Ing:integer,name:string,description:string,price:integer,createdAt:date,updatedAt:date,previewlmg:boolean

npx sequelize model:generate --name SpotImage --attributes spotld:integer,url:string

npx sequelize model:generate --name ReviewImage --attributes spotld:integer,url:string
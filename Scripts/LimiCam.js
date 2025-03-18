/*******************************
[rewrite_local]
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-header https://raw.githubusercontent.com/bpxtc/must/refs/heads/main/Scripts/LimiCam.js
^https:\/\/api\.(revenuecat|rc-backup)\.com\/.+\/(receipts$|subscribers\/.+$) url script-request-body https://raw.githubusercontent.com/bpxtc/must/refs/heads/main/Scripts/LimiCam.js
[mitm] 
hostname = api.revenuecat.com,api.rc-backup.com
*******************************/
let obj = {};

let creakinfo = {"appId":"com.uzero.cn.FoJiCam","productId":"com.uzero.cn.fojicam.month1","entitlements":["Pro"]}

if(typeof $response == "undefined") {
  delete $request.headers["x-revenuecat-etag"];
  delete $request.headers["X-RevenueCat-ETag"];
  obj.headers = $request.headers;
}else {
  let body = JSON.parse(typeof $response != "undefined" && $response.body || null);
  if(body && body.subscriber) {
    let date = {"expires_date": "2999-01-01T00:00:00Z","original_purchase_date":"2021-01-01T00:00:00Z","purchase_date": "2021-01-01T00:00:00Z","ownership_type": "PURCHASED","store": "app_store"};
    let subscriber = body.subscriber;
    const newObj = Object.fromEntries(Object.entries($request.headers).map(([k, v]) => [k.toLowerCase(), v]));
    let app_id = newObj["x-client-bundle-id"]?newObj["x-client-bundle-id"]:newObj["user-agent"].match(/^[-_%a-zA-Z0-9]+/)[0];
    const list = [
      creakinfo
   ];  
   for(let data of list){
     if(app_id == data.appId){
       let product_id = data.productId;
       let entitlements = data.entitlements;
       subscriber.subscriptions[(product_id)] = date;
       for (let entitlement of entitlements) {
         subscriber.entitlements[(entitlement)] = date;        
         subscriber.entitlements[(entitlement)].product_identifier = product_id; 
       }
       break; 
     }   
   }
   obj.body = JSON.stringify(body);
  }
}

$done(obj);


fetch("https://www.instagram.com/api/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7,uk;q=0.6",
    "content-type": "application/x-www-form-urlencoded",
    "dpr": "2",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
    "sec-ch-ua-full-version-list": "\"Not_A Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"120.0.6099.109\", \"Google Chrome\";v=\"120.0.6099.109\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-model": "\"\"",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-ch-ua-platform-version": "\"12.6.7\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "viewport-width": "1280",
    "x-asbd-id": "129477",
    "x-csrftoken": "zSWPESfN2ajMBTIjrcBcUDdhJSwUi7wF",
    "x-fb-friendly-name": "PolarisProfilePostsQuery",
    "x-fb-lsd": "nfYf781kPBiEuxQPyDddbu",
    "x-ig-app-id": "936619743392459"
  },
  "referrer": "https://www.instagram.com/shop_mens_clothing_",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "av=17841405956214284&__d=www&__user=0&__a=1&__req=3&__hs=19716.HYP%3Ainstagram_web_pkg.2.1..0.1&dpr=2&__ccg=UNKNOWN&__rev=1010586189&__s=myqenr%3A86vx9w%3Adyxgl5&__hsi=7316665892809715781&__dyn=7xeUjG1mxu1syUbFp60DU98nwgU7SbzEdF8aUco2qwJxS0k24o0B-q1ew65xO2O1Vw8G1nzUO0n24oaEd86a3a1YwBgao6C0Mo2sx-0z8-U2zxe2GewGwso88cobEaU2eUlwhEe87q7U1bobpEbUGdG1QwTwFwIw8O321LwTwKG1pg661pwr86C1mwrd6go-68jxe6U&__csr=gB5T13koGlYZGBQQuAy8yptaRQESOGFa_GWCABVrQvDgGFe7kmuVtemuhzpy29VqK9CUx4DoGFFUyKpSA9Gmejhpp-Fkjy-UKm4EG6EybzF9K00j990tpJ01mulk05ZE0tsCDgwi7u0ZEScx-u2uOk0kSm0gPo1Xo1joAU3Bw4Zw3g63qm7V7g5-00FP8&__comet_req=7&fb_dtsg=NAcOt4sz-PyloaP2JtdfmIr1okwF6Lj1KTeB0YSzMVmj_QvI9hT-2kg%3A17865379441060568%3A1703538642&jazoest=26341&lsd=nfYf781kPBiEuxQPyDddbu&__spin_r=1010586189&__spin_b=trunk&__spin_t=1703544029&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=PolarisProfilePostsQuery&variables=%7B%22data%22%3A%7B%22count%22%3A12%2C%22include_relationship_info%22%3Atrue%2C%22latest_besties_reel_media%22%3Atrue%2C%22latest_reel_media%22%3Atrue%7D%2C%22username%22%3A%22shop_mens_clothing_%22%7D&server_timestamps=true&doc_id=7236321249746935",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
})
  // .then(async (e) => console.log(await e.json()))
  .then(async (e) => console.log(await e.json()))
  .catch((e) => console.log(e));
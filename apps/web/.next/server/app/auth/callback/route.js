"use strict";(()=>{var e={};e.id=936,e.ids=[936],e.modules={2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},4300:e=>{e.exports=require("buffer")},6113:e=>{e.exports=require("crypto")},2361:e=>{e.exports=require("events")},3685:e=>{e.exports=require("http")},5687:e=>{e.exports=require("https")},1808:e=>{e.exports=require("net")},5477:e=>{e.exports=require("punycode")},2781:e=>{e.exports=require("stream")},4404:e=>{e.exports=require("tls")},7310:e=>{e.exports=require("url")},9796:e=>{e.exports=require("zlib")},9492:(e,r,t)=>{t.r(r),t.d(r,{headerHooks:()=>m,originalPathname:()=>w,patchFetch:()=>b,requestAsyncStorage:()=>h,routeModule:()=>p,serverHooks:()=>x,staticGenerationAsyncStorage:()=>g,staticGenerationBailout:()=>f});var o={};t.r(o),t.d(o,{GET:()=>d,dynamic:()=>u});var n=t(5419),i=t(9108),s=t(9678),a=t(7699),c=t(7439),l=t(8070);let u="force-dynamic";async function d(e){try{console.log("Auth callback route triggered");let r=new URL(e.url),t=(0,c.cookies)(),o=(0,a.createRouteHandlerClient)({cookies:()=>t}),n=r.searchParams.get("code");if(n){console.log("Found code in URL, exchanging for session...");let{error:e,data:t}=await o.auth.exchangeCodeForSession(n);if(e)return console.error("Error exchanging code for session:",e),l.Z.redirect(new URL(`/?error=${encodeURIComponent(e.message)}`,r.origin));if(!t||!t.session)return console.error("No session returned after code exchange"),l.Z.redirect(new URL("/?error=Authentication%20failed",r.origin));if(console.log("Session exchange successful, redirecting to dashboard"),!t.session.user.email_confirmed_at)return l.Z.redirect(new URL("/?error=Please%20verify%20your%20email",r.origin));let i=`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authentication Successful</title>
            <script>
              window.onload = function() {
                // Try to notify the opener window
                if (window.opener) {
                  try {
                    window.opener.postMessage('auth_complete', window.location.origin);
                    // Close this tab after sending the message
                    window.close();
                  } catch (e) {
                    console.error('Could not communicate with opener:', e);
                  }
                }
                // If we couldn't close the tab, redirect to dashboard
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 1000);
              };
            </script>
            <style>
              body {
                font-family: system-ui, -apple-system, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background-color: #f9fafb;
              }
              .container {
                text-align: center;
                padding: 2rem;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                max-width: 400px;
              }
              h1 { color: #1a56db; margin-bottom: 1rem; }
              p { color: #374151; line-height: 1.5; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Authentication Successful!</h1>
              <p>You can now close this tab and return to the PR Reviewer.</p>
            </div>
          </body>
        </html>
      `;return new Response(i,{headers:{"Content-Type":"text/html","Cache-Control":"no-store, no-cache, must-revalidate, proxy-revalidate"}})}return console.error("No authentication code found in URL"),l.Z.redirect(new URL("/",r.origin))}catch(r){return console.error("Unexpected error in auth callback:",r),l.Z.redirect(new URL("/?error=Unexpected%20error",e.url))}}let p=new n.AppRouteRouteModule({definition:{kind:i.x.APP_ROUTE,page:"/auth/callback/route",pathname:"/auth/callback",filename:"route",bundlePath:"app/auth/callback/route"},resolvedPagePath:"/Users/alpinro/Code Prjects/pr-reviewer-v2/apps/web/src/app/auth/callback/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:h,staticGenerationAsyncStorage:g,serverHooks:x,headerHooks:m,staticGenerationBailout:f}=p,w="/auth/callback/route";function b(){return(0,s.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:g})}}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),o=r.X(0,[638,206,421],()=>t(9492));module.exports=o})();
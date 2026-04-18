"use strict";exports.id=7945,exports.ids=[7945],exports.modules={1800:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{oC:()=>l,ru:()=>k});var e=c(23211),f=c(20903),g=c(75587),h=c(35909),i=c(21199),j=a([f,g,i]);function k(a,b){return async(c,d)=>{let j=c.headers.get("authorization"),k=null;if(j){let a=await (0,g.b9)(j);k=a?.user??null}else{let a=c.cookies.get("session")?.value;if(a){let b=await (0,h.g)(a);b&&(k=await (0,i.nC)(b.userId))}}if(!k){let a=(0,f.yj)("UNAUTHORIZED","Unauthorized",401);return e.NextResponse.json(a.body,{status:a.status})}if(!(0,g.Yj)(k.role,a)){let a=(0,f.yj)("FORBIDDEN","Forbidden",403);return e.NextResponse.json(a.body,{status:a.status})}return b(c,k,d)}}async function l(a,b){let c=a.headers.get("authorization"),d=null;if(c){let a=await (0,g.b9)(c);d=a?.user??null}else{let b=a.cookies.get("session")?.value;if(b){let a=await (0,h.g)(b);a&&(d=await (0,i.nC)(a.userId))}}return d?(0,g.Yj)(d.role,b)?d:e.NextResponse.json((0,f.yj)("FORBIDDEN","Forbidden",403).body,{status:403}):e.NextResponse.json((0,f.yj)("UNAUTHORIZED","Unauthorized",401).body,{status:401})}[f,g,i]=j.then?(await j)():j,d()}catch(a){d(a)}})},13240:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{$W:()=>r,BM:()=>y,CW:()=>D,HP:()=>G,OX:()=>z,Py:()=>u,Tt:()=>p,W9:()=>s,Zk:()=>A,bn:()=>F,cH:()=>t,gn:()=>H,gq:()=>x,iw:()=>C,jl:()=>h,p2:()=>q,p7:()=>E,po:()=>B,tq:()=>w,vd:()=>v});var e=c(20903),f=c(36237),g=a([e,f]);async function h(a){let b=await (0,e.Zy)("SELECT id, owner_id, parent_id, visibility, is_system FROM folders WHERE id = $1",[a]);return b?(0,e.U9)("folders",b):void 0}async function i(a){let b=await h(a);for(let a=0;a<10&&b;a++){if("inherit"!==b.visibility)return b.visibility;if(null===b.parent_id)break;b=await h(b.parent_id)}return"personal"}async function j(a){return null!==a.visibility_override?a.visibility_override:i(a.folder_id)}async function k(a){return(await (0,e.P)("SELECT group_id FROM user_group_members WHERE user_id = $1",[a])).map(a=>a.group_id)}async function l(a,b){let c=await k(a.id);if(0===c.length)return null;let d=await (0,f._T)({folderId:b,groupIds:c});return 0===d.length?null:d.some(a=>"contributor"===a.access_level)?"contributor":"reader"}async function m(a,b){let c=await k(a.id);if(0===c.length)return null;let d=await (0,f.DY)({workflowId:b,groupIds:c});return 0===d.length?null:d.some(a=>"contributor"===a.access_level)?"contributor":"reader"}async function n(a,b){let c=await k(a.id);if(0===c.length)return null;let d=await (0,f.JP)({credentialId:b,groupIds:c});return 0===d.length?null:d.some(a=>"manage"===a.access_level)?"manage":"use"}function o(a,b){return b.includes(a.role)}async function p(a,b){if(b.owner_id===a.id||o(a,["admin","superuser"]))return!0;let c=await j(b);if("public"===c)return!0;if("group"===c){let c=await m(a,b.id);return null!==c||await l(a,b.folder_id)!==null}return!1}async function q(a,b){if(b.owner_id===a.id||"superuser"===a.role)return!0;let c=await j(b);if("group"===c){let c=await m(a,b.id);if("contributor"===c)return!0;let d=await l(a,b.folder_id);return"contributor"===d}return!1}async function r(a,b){return b.owner_id===a.id||o(a,["admin","superuser"])}async function s(a,b){return b.owner_id===a.id||"superuser"===a.role}async function t(a,b){return p(a,b)}async function u(a,b){return b.owner_id===a.id||o(a,["admin","superuser"])}async function v(a,b){return!!(b.owner_id===a.id||o(a,["admin","superuser"]))||"public"===b.visibility||"group"===b.visibility&&await l(a,b.id)!==null}async function w(a,b){return b.owner_id===a.id||"superuser"===a.role||"group"===b.visibility&&await l(a,b.id)==="contributor"}async function x(a,b){return!b.is_system&&(b.owner_id===a.id||"superuser"===a.role)}async function y(a,b,c){return"public"===c||"public"===b.visibility?o(a,["admin","superuser"]):b.owner_id===a.id||o(a,["admin","superuser"])}async function z(a,b){return b.owner_id===a.id||o(a,["admin","superuser"])}async function A(a,b){if(b.owner_id===a.id||"superuser"===a.role)return!0;let c=await n(a,b.id);return null!==c}async function B(a,b){if(b.owner_id===a.id||"superuser"===a.role)return!0;let c=await n(a,b.id);return"manage"===c}async function C(a,b){return!!await A(a,b)||"admin"===a.role}async function D(a,b){return B(a,b)}async function E(a,b){return B(a,b)}async function F(a,b,c){let d=await k(b.id),e=[b.id],f=c,g=f;f+=1;let h=`(
    f.visibility = 'public'
    OR (f.visibility = 'inherit' AND f.parent_id IS NOT NULL
        AND EXISTS (SELECT 1 FROM folders pf WHERE pf.id = f.parent_id AND pf.visibility = 'public'))
  )`,i="FALSE",j="FALSE";if(d.length>0){let b=d.map((a,b)=>`$${f+b}`).join(", ");e.push(...d),f+=d.length;let c=`(
      f.visibility = 'group'
      OR (f.visibility = 'inherit' AND f.parent_id IS NOT NULL
          AND EXISTS (SELECT 1 FROM folders pf WHERE pf.id = f.parent_id AND pf.visibility = 'group'))
    )`;i=`(
      (
        ${a}.visibility_override IS NULL
        AND ${c}
        AND EXISTS (
          SELECT 1 FROM folder_shares fs
          WHERE fs.folder_id IN (f.id, f.parent_id)
            AND fs.group_id IN (${b})
        )
      )
    )`,j=`(
      ${a}.visibility_override = 'group'
      AND EXISTS (
        SELECT 1 FROM workflow_shares ws
        WHERE ws.workflow_id = ${a}.id
          AND ws.group_id IN (${b})
      )
    )`}return{sql:`(
    ${a}.owner_id = $${g}
    OR (${a}.visibility_override = 'public')
    OR ${j}
    OR EXISTS (
      SELECT 1 FROM folders f
      WHERE f.id = ${a}.folder_id
        AND (
          (${a}.visibility_override IS NULL AND ${h})
          OR ${i}
        )
    )
  )`,params:e}}async function G(a,b,c){let d=await k(b.id),e=[b.id],f=c,g=f;f+=1;let h=`(
    ${a}.visibility = 'inherit' AND ${a}.parent_id IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM folders pf
      WHERE pf.id = ${a}.parent_id AND pf.visibility = 'public'
    )
  )`,i="FALSE",j="FALSE";if(d.length>0){let b=d.map((a,b)=>`$${f+b}`).join(", ");e.push(...d),i=`(
      ${a}.visibility = 'group' AND EXISTS (
        SELECT 1 FROM folder_shares fs
        WHERE fs.folder_id IN (${a}.id, ${a}.parent_id)
          AND fs.group_id IN (${b})
      )
    )`,j=`(
      ${a}.visibility = 'inherit' AND ${a}.parent_id IS NOT NULL
      AND EXISTS (
        SELECT 1 FROM folders pf
        WHERE pf.id = ${a}.parent_id AND pf.visibility = 'group'
      )
      AND EXISTS (
        SELECT 1 FROM folder_shares fs
        WHERE fs.folder_id IN (${a}.parent_id)
          AND fs.group_id IN (${b})
      )
    )`,f+=d.length}return{sql:`(
    ${a}.owner_id = $${g}
    OR ${a}.visibility = 'public'
    OR ${h}
    OR ${i}
    OR ${j}
  )`,params:e}}async function H(a,b,c){let d=await k(b.id),e=[b.id],f=c,g=f;f+=1;let h="FALSE";if(d.length>0){let b=d.map((a,b)=>`$${f+b}`).join(", ");e.push(...d),h=`EXISTS (
      SELECT 1 FROM credential_shares cs
      WHERE cs.credential_id = ${a}.id
        AND cs.group_id IN (${b})
    )`,f+=d.length}let i="admin"===b.role?"OR TRUE":"";return{sql:`(
    ${a}.owner_id = $${g}
    OR ${h}
    ${i}
  )`,params:e}}[e,f]=g.then?(await g)():g,d()}catch(a){d(a)}})},21199:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{ZL:()=>i,ar:()=>j,l5:()=>k,nC:()=>h});var e=c(4785),f=c(20903),g=a([f]);async function h(a){let b=await (0,f.Zy)("SELECT * FROM users WHERE id = $1 AND is_active = true",[a]);return b?{...b,is_active:(0,e.J2)(b.is_active),created_at:(0,e.pC)(b.created_at)??new Date(0).toISOString(),updated_at:(0,e.pC)(b.updated_at)??new Date(0).toISOString()}:null}async function i(a){let b=await (0,f.Zy)("SELECT id, username, email, password_hash, role, must_change_password FROM users WHERE email = $1",[a]);return b?{...b,must_change_password:(0,e.J2)(b.must_change_password)}:null}async function j(a){let b=await (0,f.Zy)("SELECT * FROM api_keys WHERE key_hash = $1 AND is_revoked = false",[a]);return b?{...b,last_used_at:(0,e.pC)(b.last_used_at),expires_at:(0,e.pC)(b.expires_at),is_revoked:(0,e.J2)(b.is_revoked),created_at:(0,e.pC)(b.created_at)??new Date(0).toISOString()}:null}async function k(a){await (0,f.g7)("UPDATE api_keys SET last_used_at = $1 WHERE id = $2",[new Date().toISOString(),a])}f=(g.then?(await g)():g)[0],d()}catch(a){d(a)}})},35909:(a,b,c)=>{c.d(b,{g:()=>h,j:()=>g});var d=c(86935),e=c(69614);let f=new TextEncoder().encode(process.env.JWT_SECRET||"watermelon-dev-secret-change-in-production");async function g(a){return new d.P({...a}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(f)}async function h(a){try{let{payload:b}=await (0,e.V)(a,f);return{userId:b.userId,username:b.username,email:b.email,role:b.role,mustChangePassword:b.mustChangePassword??!1}}catch{return null}}},36237:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{DY:()=>i,JP:()=>j,_T:()=>h});var e=c(20903),f=a([e]);function g(a,b){if(0===b.length)return{clause:"(NULL)",params:[]};let c=b.map((b,c)=>`$${a+c}`);return{clause:`(${c.join(", ")})`,params:b}}async function h(a){if(0===a.groupIds.length)return[];let b=g(2,a.groupIds);return(0,e.P)(`SELECT fs.access_level
       FROM folder_shares fs
       JOIN folders f ON f.id = $1
       WHERE fs.folder_id IN (f.id, f.parent_id)
         AND fs.group_id IN ${b.clause}`,[a.folderId,...b.params])}async function i(a){if(0===a.groupIds.length)return[];let b=g(2,a.groupIds);return(0,e.P)(`SELECT access_level FROM workflow_shares
       WHERE workflow_id = $1 AND group_id IN ${b.clause}`,[a.workflowId,...b.params])}async function j(a){if(0===a.groupIds.length)return[];let b=g(2,a.groupIds);return(0,e.P)(`SELECT access_level FROM credential_shares
      WHERE credential_id = $1 AND group_id IN ${b.clause}`,[a.credentialId,...b.params])}e=(f.then?(await f)():f)[0],d()}catch(a){d(a)}})},75587:(a,b,c)=>{c.a(a,async(a,d)=>{try{c.d(b,{BE:()=>j,Er:()=>i,XH:()=>k,Yj:()=>n,_m:()=>m,b9:()=>o});var e=c(55511),f=c(93139),g=c(21199),h=a([f,g]);async function i(a){return f.default.hash(a,12)}async function j(a,b){return f.default.compare(a,b)}function k(){let a=(0,e.randomBytes)(32),b="bk_"+a.toString("base64url"),c=b.slice(0,10),d=(0,e.createHash)("sha256").update(b).digest("hex");return{rawKey:b,prefix:c,keyHash:d}}async function l(a){let b=(0,e.createHash)("sha256").update(a).digest("hex"),c=await (0,g.ar)(b);if(!c||c.expires_at&&new Date(c.expires_at)<new Date)return null;let d=await (0,g.nC)(c.user_id);return d?((0,g.l5)(c.id).catch(()=>{}),{user:d,apiKey:c}):null}[f,g]=h.then?(await h)():h;let p={viewer:0,editor:1,admin:2,superuser:3};function m(a,b){return p[a]>=p[b]}let q={"workflows:read":"viewer","workflows:create":"editor","workflows:update":"editor","workflows:delete":"editor","tasks:read":"viewer","tasks:create":"editor","tasks:execute":"viewer","credentials:read":"viewer","credentials:write":"editor","users:read":"admin","users:write":"admin","users:create_admin":"superuser","apikeys:read_own":"viewer","apikeys:create":"viewer","apikeys:read_all":"admin","apikeys:revoke_all":"admin","instructions:read":"viewer","instructions:write":"editor"};function n(a,b){let c=q[b];return m(a,c)}async function o(a){if(!a)return null;let b=a.match(/^Bearer\s+(bk_.+)$/i);return b?l(b[1]):null}d()}catch(a){d(a)}})}};
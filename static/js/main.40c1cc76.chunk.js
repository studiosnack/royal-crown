(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{29:function(e,t,n){e.exports=n(56)},34:function(e,t,n){},38:function(e,t,n){},56:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),o=n(23),u=n.n(o),c=(n(34),n(15)),i=n(28),s=n(6),l=n.n(s),p=n(11),d=n(16),h=n(8),f=(n(38),n(58)),v=n(59),m=n(61),y=n(60),w=n(24),g=n(25),b=n.n(g),E=new w.a("rc");window.__db=E;var O=function(e,t){switch(t.type){case"api-key":return Object(h.a)({},e,{apiKey:t.payload});case"username":return Object(h.a)({},e,{username:t.payload});case"repo":return Object(h.a)({},e,{repo:t.payload});case"update":case"@@pouch/init":return t.payload;default:return e}},j={apiKey:"",username:"",repo:""},q=function(e){var t=e.state,n=e.dispatch;return a.a.createElement(a.a.Fragment,null,a.a.createElement("label",null,"username:"," ",a.a.createElement("input",{value:t.username||"",onChange:function(e){return n({type:"username",payload:e.currentTarget.value})}})),a.a.createElement("label",null,"api-key:"," ",a.a.createElement("input",{value:t.apiKey||"",onChange:function(e){return n({type:"api-key",payload:e.currentTarget.value})}})),a.a.createElement("label",null,"repo:"," ",a.a.createElement("input",{value:t.repo||"",onChange:function(e){return n({type:"repo",payload:e.currentTarget.value})}})))},k=function(e){var t=e.repo,n=e.username;return a.a.createElement(m.a,{query:Object(y.a)("query ($queryRequested: String!, $queryReviewed: String!) {\n  rateLimit {\n    cost\n    limit\n  }\n  reviewed: search(query: $queryReviewed, type: ISSUE, first: 20) {\n    ...prData\n  }\n  requested: search(query: $queryRequested, type: ISSUE, first: 20) {\n    ...prData\n  }\n}\n\nfragment prData on SearchResultItemConnection {\n  nodes {\n    ... on PullRequest {\n      id\n      author {\n        login\n      }\n      url\n      title\n      state\n      createdAt\n      reviews(first: 50) {\n        nodes {\n          ... on PullRequestReview {\n            author {\n              login\n            }\n            state\n            submittedAt\n          }\n        }\n      }\n    }\n  }\n}\n\n",{queryRequested:"repo:".concat(t," review-requested:").concat(n," type:pr is:open"),queryReviewed:"repo:".concat(t," reviewed-by:").concat(n," type:pr is:open")})},function(e){var t=e.fetching,r=e.loaded,o=(e.error,e.data),u=e.refetch;return a.a.createElement("div",null,t&&"fetching...",r&&!t&&"loaded!",r&&a.a.createElement("button",{type:"button",onClick:function(){return u({skipCache:!0})}},"re-fetch data"),r&&o.requested.nodes.map(function(e){return a.a.createElement(R,{key:e.id,pr:e,username:n})}))})},R=function(e){var t=e.pr,n=e.username,r=t.reviews.nodes.filter(function(e){return e.author.login===n&&"COMMENTED"!==e.state}).length>0,o=Object(c.a)(t.reviews.nodes.filter(function(e){return e.author.login===n&&"APPROVED"===e.state})).pop(),u=t.reviews.nodes.filter(function(e){return e.author.login===n&&"COMMENTED"===e.state}).length>0;return a.a.createElement("div",null,!r&&"\ud83d\udea8",o&&"\u2705",u&&"\ud83d\udcac",a.a.createElement("a",{target:"_blank",rel:"noopener noreferrer",href:t.url},"#",Object(c.a)(t.url.split("/")).pop()," - ",t.author.login," - ",t.title))},x=function(){var e=function(e,t,n){var a=Object(r.useReducer)(e,t),o=Object(d.a)(a,2),u=o[0],c=o[1];Object(r.useEffect)(Object(p.a)(l.a.mark(function e(){var r;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,E.get(n);case 3:r=e.sent,c({type:"@@pouch/init",payload:r}),e.next=16;break;case 7:return e.prev=7,e.t0=e.catch(0),e.next=11,E.put(Object(h.a)({},t,{_id:n}));case 11:return e.sent,e.next=14,E.get(n);case 14:r=e.sent,c({type:"@@pouch/init",payload:r});case 16:case"end":return e.stop()}},e,this,[[0,7]])})),[n]);var s=function(){var e=Object(p.a)(l.a.mark(function e(t){var r,a,o;return l.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,t._rev,r=Object(i.a)(t,["_rev"]),e.next=4,E.get(n);case 4:return a=e.sent,o=Object(h.a)({},a,r),e.next=8,E.put(o);case 8:e.next=14;break;case 10:e.prev=10,e.t0=e.catch(0),console.error("there was an error saving to pouch"),console.error(e.t0||e.t0.stack);case 14:case"end":return e.stop()}},e,this,[[0,10]])}));return function(t){return e.apply(this,arguments)}}(),f=b()(s,2e3);return[u,function(){var t=Object(p.a)(l.a.mark(function t(n){var r;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:r=e(u,n),c(n),f(r);case 3:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}()]}(O,j,"settings"),t=Object(d.a)(e,2),n=t[0],o=t[1],u=Object(r.useMemo)(function(){return new f.a({url:"https://api.github.com/graphql",fetchOptions:function(){var e={headers:{"Content-Type":"application/json"}};return n.apiKey&&40===n.apiKey.length&&(e.headers=Object(h.a)({},e.headers,{Authorization:"Bearer ".concat(n.apiKey)})),e}})},[n.apiKey]);return a.a.createElement("div",null,a.a.createElement(q,{state:n,dispatch:o}),a.a.createElement(v.a,{client:u},a.a.createElement(k,{repo:n.repo,username:n.username})))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));u.a.render(a.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[29,2,1]]]);
//# sourceMappingURL=main.40c1cc76.chunk.js.map
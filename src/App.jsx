import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Plus, Minus, X, Check, Trash2, Package, ClipboardList, ArrowRight, Store, Truck, Building2, Lock, LogOut, ArrowUpLeft, ShieldCheck, Sparkles, Pencil, Upload, Image as ImageIcon } from "lucide-react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
const IS_DEFAULT_PW = ADMIN_PASSWORD === "admin123";
const WILAYAS = ["01 - أدرار","02 - الشلف","03 - الأغواط","04 - أم البواقي","05 - باتنة","06 - بجاية","07 - بسكرة","08 - بشار","09 - البليدة","10 - البويرة","11 - تمنراست","12 - تبسة","13 - تلمسان","14 - تيارت","15 - تيزي وزو","16 - الجزائر","17 - الجلفة","18 - جيجل","19 - سطيف","20 - سعيدة","21 - سكيكدة","22 - سيدي بلعباس","23 - عنابة","24 - قالمة","25 - قسنطينة","26 - المدية","27 - مستغانم","28 - المسيلة","29 - معسكر","30 - ورقلة","31 - وهران","32 - البيض","33 - إليزي","34 - برج بوعريريج","35 - بومرداس","36 - الطارف","37 - تندوف","38 - تيسمسيلت","39 - الوادي","40 - خنشلة","41 - سوق أهراس","42 - تيبازة","43 - ميلة","44 - عين الدفلى","45 - النعامة","46 - عين تموشنت","47 - غرداية","48 - غليزان","49 - تيميمون","50 - برج باجي مختار","51 - أولاد جلال","52 - بني عباس","53 - عين صالح","54 - عين قزام","55 - تقرت","56 - جانت","57 - المغير","58 - المنيعة"];
const SEED_PRODUCTS = [
  { id: "p1", name: "سماعات بلوتوث", price: 3500, quantity: 25, desc: "صوت نقي مع عزل ضجيج، بطارية 28 ساعة، شحن Type-C.", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=700&q=80&auto=format" },
  { id: "p2", name: "ساعة ذكية", price: 6900, quantity: 12, desc: "شاشة AMOLED، تتبع نوم ورياضة، مقاومة 5ATM.", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80&auto=format" },
  { id: "p3", name: "شاحن سريع 20W", price: 1800, quantity: 40, desc: "شحن 50% في 30 دقيقة، حماية من الحرارة.", img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=700&q=80&auto=format" },
];
const T = {
  ar: {
    currency:"دج", view:"عرض →", empty:"لا توجد منتجات حاليا", detail:"تفاصيل المنتج", available:"متوفر", orderNow:"اطلب الآن", confirmPhone:"تأكيد هاتفي خلال ساعات", continueOrder:"متابعة الطلب",
    orderInfo:"معلومات الطلب", firstName:"الاسم", lastName:"اللقب", phone:"رقم الهاتف", wilaya:"الولاية", choose:"اختر", delivery:"التوصيل", office:"مكتب", home:"منزل", total:"المجموع النهائي", confirm:"تأكيد الطلب", sending:"جاري الإرسال...", human:`تأكيد بشري`, result:"النتيجة",
    errName:"أدخل الاسم و اللقب", errShort:"الاسم قصير جدا", errPhone:"رقم الهاتف غير صحيح", errWilaya:"اختر الولاية", errBot:"تم كشف نشاط مشبوه", errWait:(s)=>`مهلا! انتظر ${s} ثانية قبل طلب جديد`, errDup:"لقد طلبت هذا المنتج منذ قليل — انتظر 5 دقائق",
    spamWait:(s)=>`مهلا! انتظر ${s} ثانية`, successTitle:"تم استلام طلبك", successMsg:"شكرا لثقتك. سيتصل بك فريقنا خلال ساعات لتأكيد التوصيل.", saved:"رقم الطلب محفوظ", continueShop:"متابعة التسوق", banner:"DZ Store",
    loading:"جاري التحميل...", outOfStock:"نفد المخزون", stockLeft:(n)=>`متوفر: ${n}`, orderNo:"رقم الطلب",
    errStock:(n)=> n>0?`الكمية المتوفرة: ${n} فقط`:"نفد المخزون", errGone:"هذا المنتج لم يعد متوفرا", errStorage:"تعذر حفظ الطلب — مساحة التخزين ممتلئة"
  },
  en: {
    currency:"DZD", view:"View →", empty:"No products yet", detail:"Product Details", available:"In stock", orderNow:"Order Now", confirmPhone:"Phone confirmation within hours", continueOrder:"Continue",
    orderInfo:"Order Info", firstName:"First Name", lastName:"Last Name", phone:"Phone", wilaya:"Province", choose:"Select", delivery:"Delivery", office:"Office", home:"Home", total:"Total", confirm:"Confirm Order", sending:"Sending...", human:"Human check", result:"Result",
    errName:"Enter first & last name", errShort:"Name too short", errPhone:"Invalid phone", errWilaya:"Select province", errBot:"Bot detected", errWait:(s)=>`Wait ${s}s before next order`, errDup:"You ordered this recently — wait 5 min",
    spamWait:(s)=>`Wait ${s}s`, successTitle:"Order Received", successMsg:"Thanks! We'll call you within hours to confirm. Cash on delivery.", saved:"Order saved", continueShop:"Continue Shopping", banner:"DZ Store",
    loading:"Loading...", outOfStock:"Out of stock", stockLeft:(n)=>`${n} in stock`, orderNo:"Order No.",
    errStock:(n)=> n>0?`Only ${n} left in stock`:"Out of stock", errGone:"This product is no longer available", errStorage:"Could not save the order — storage is full"
  }
};
function riyal(n, lang="ar"){ return n.toLocaleString(lang==="en"?"en-US":"en-DZ") + " " + (lang==="en"?"DZD":"دج"); }
async function storageGet(k){ try{ const r=localStorage.getItem(k); return r?JSON.parse(r):null }catch{return null} }
// Throws when the quota is full. Callers MUST surface it — swallowing it shows data as saved that is gone on reload.
async function storageSet(k,v){ localStorage.setItem(k,JSON.stringify(v)) }
function isQuotaError(e){ return !!e && (e.name==="QuotaExceededError" || e.name==="NS_ERROR_DOM_QUOTA_REACHED" || e.code===22) }
// Product images land inside inline CSS. A raw ) or " would close url() and let the rest inject declarations.
function cssUrl(s){
  const v=String(s||"");
  if(/^data:image\/[a-z0-9+.-]+;base64,[A-Za-z0-9+/=]*$/i.test(v)) return `url("${v}")`;
  if(!/^(https?:\/\/|blob:)/i.test(v)) return "none";
  return `url("${v.replace(/[\\"'()\s]/g, c=>"%"+c.charCodeAt(0).toString(16).padStart(2,"0"))}")`;
}
// localStorage caps around 5MB and base64 inflates by ~4/3, so a phone photo has to come down to ~100KB.
async function shrinkImage(file, max=900, quality=.82){
  const url=URL.createObjectURL(file);
  try{
    const img=await new Promise((res,rej)=>{ const i=new Image(); i.onload=()=>res(i); i.onerror=()=>rej(new Error("IMG")); i.src=url });
    const scale=Math.min(1, max/Math.max(img.width,img.height));
    const w=Math.max(1,Math.round(img.width*scale)), h=Math.max(1,Math.round(img.height*scale));
    const c=document.createElement("canvas"); c.width=w; c.height=h;
    const ctx=c.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,w,h); ctx.drawImage(img,0,0,w,h);
    return c.toDataURL("image/jpeg",quality);
  } finally { URL.revokeObjectURL(url) }
}
function isAdminAuthenticated(){ return localStorage.getItem("dz-admin-auth")==="true" }
function sanitize(s){ return String(s||"").replace(/[<>`$]/g,"").trim().slice(0,80); }
function canPlaceOrder(){
  const now=Date.now();
  const last=Number(localStorage.getItem("dz-last-order")||0);
  if(now-last < 60000) return {ok:false, wait: Math.ceil((60000-(now-last))/1000)};
  const arr=JSON.parse(localStorage.getItem("dz-order-times")||"[]");
  const recent=arr.filter(t=> now-t < 10*60*1000);
  if(recent.length>=3) return {ok:false, wait: Math.ceil((recent[0]+10*60*1000 - now)/1000)};
  return {ok:true};
}
function recordOrder(){
  const now=Date.now();
  localStorage.setItem("dz-last-order", String(now));
  const arr=JSON.parse(localStorage.getItem("dz-order-times")||"[]");
  arr.push(now);
  localStorage.setItem("dz-order-times", JSON.stringify(arr.slice(-10)));
}
function isDuplicateOrder(phone, productId){
  const orders=JSON.parse(localStorage.getItem("dz-store-orders")||"[]");
  const now=Date.now();
  return orders.some(o=> o.phone===phone && o.productId===productId && (now - new Date(o.createdAt).getTime()) < 5*60*1000);
}

export default function App(){
  const [lang,setLang]=useState(()=> localStorage.getItem("dz-lang")||"ar");
  const t=(k,...a)=>{ const v=T[lang][k]; return typeof v==="function"?v(...a):v||k; };
  useEffect(()=>{ localStorage.setItem("dz-lang", lang); document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr"; },[lang]);
  const [products,setProducts]=useState(null);
  const [orders,setOrders]=useState(null);
  const [loading,setLoading]=useState(true);
  const load=useCallback(async()=>{
    setLoading(true);
    let p=await storageGet("dz-store-products");
    let o=await storageGet("dz-store-orders");
    if(!p){ p=SEED_PRODUCTS; await storageSet("dz-store-products",p).catch(()=>{}) }
    else { p = p.map(x=>({...x, quantity: Number(x.quantity)||0})); }
    if(!o){ o=[]; await storageSet("dz-store-orders",o).catch(()=>{}) }
    setProducts(p); setOrders(o); setLoading(false);
  },[]);
  useEffect(()=>{ load() },[load]);
  // Another tab wrote — take its version. Without this, two tabs each write their whole array from stale state.
  useEffect(()=>{
    const onStorage=(e)=>{
      try{
        if(e.key==="dz-store-products") setProducts(JSON.parse(e.newValue||"[]"));
        if(e.key==="dz-store-orders") setOrders(JSON.parse(e.newValue||"[]"));
      }catch{/* ignore a partial write from another tab */}
    };
    window.addEventListener("storage",onStorage);
    return ()=>window.removeEventListener("storage",onStorage);
  },[]);
  // Writes both keys or neither, so a full quota can't leave an order recorded with stock never deducted.
  const commit=async(nextOrders,nextProducts)=>{
    const prevOrders=nextOrders?await storageGet("dz-store-orders"):null;
    if(nextOrders) await storageSet("dz-store-orders",nextOrders);
    if(nextProducts){
      try{ await storageSet("dz-store-products",nextProducts) }
      catch(e){ if(nextOrders) await storageSet("dz-store-orders",prevOrders||[]).catch(()=>{}); throw e }
    }
    if(nextOrders) setOrders(nextOrders);
    if(nextProducts) setProducts(nextProducts);
  };
  const saveProducts=(n)=>commit(null,n);
  // Re-reads storage first so a concurrent tab's orders survive, then deducts stock in the same commit.
  const placeOrder=async(payload)=>{
    const freshOrders=(await storageGet("dz-store-orders"))||[];
    const freshProducts=(await storageGet("dz-store-products"))||[];
    const prod=freshProducts.find(p=>p.id===payload.productId);
    if(!prod) throw new Error("GONE");
    const left=Number(prod.quantity)||0;
    if(left<payload.qty) throw Object.assign(new Error("STOCK"),{left});
    const order={id:"o"+Date.now(),...payload,status:"قيد الانتظار",createdAt:new Date().toISOString()};
    await commit([order,...freshOrders], freshProducts.map(p=>p.id===prod.id?{...p,quantity:left-payload.qty}:p));
    return order;
  };
  if(loading) return <div style={{minHeight:"100vh",background:"var(--paper-2)",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{background:"#fff",border:"1px solid var(--line)",borderRadius:12,padding:"12px 14px",display:"flex",gap:10,alignItems:"center"}}><div style={{width:7,height:7,borderRadius:20,background:"var(--red)"}}/><span style={{fontWeight:700,fontSize:13}}>{t("loading")}</span></div></div>;
  return (
    <BrowserRouter>
      <div dir={lang==="ar"?"rtl":"ltr"} style={{background:"var(--paper-2)",minHeight:"100vh",padding:"10px"}}>
        <div style={{maxWidth:440,margin:"0 auto",background:"#fff",minHeight:"calc(100vh - 20px)",overflow:"hidden",border:"1px solid var(--line)",position:"relative"}}>
          <Routes>
            <Route path="/" element={<Storefront products={products} placeOrder={placeOrder} lang={lang} setLang={setLang} t={t} />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedRoute><Dashboard products={products} saveProducts={saveProducts} orders={orders} commit={commit} /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <div style={{maxWidth:440,margin:"8px auto 0",textAlign:"center",color:"#9AA3AF",fontSize:10.5,letterSpacing:.2}}>DZ Store 2026 by crypt-1sx Dev</div>
      </div>
    </BrowserRouter>
  );
}
function ProtectedRoute({children}){ if(!isAdminAuthenticated()) return <Navigate to="/admin/login" replace />; return children; }

function AdminLogin(){
  const navigate=useNavigate();
  const [pw,setPw]=useState(""); const [err,setErr]=useState("");
  useEffect(()=>{ if(isAdminAuthenticated()) navigate("/admin",{replace:true}) },[navigate]);
  const submit=(e)=>{
    e.preventDefault();
    const block=Number(localStorage.getItem("dz-admin-block")||0);
    if(Date.now()<block){ const s=Math.ceil((block-Date.now())/1000); return setErr(`محظور مؤقتا — حاول بعد ${s} ثانية`); }
    if(pw===ADMIN_PASSWORD){ localStorage.setItem("dz-admin-auth","true"); localStorage.removeItem("dz-admin-attempts"); localStorage.removeItem("dz-admin-block"); navigate("/admin",{replace:true}); }
    else {
      const n=Number(localStorage.getItem("dz-admin-attempts")||0)+1;
      localStorage.setItem("dz-admin-attempts", String(n));
      if(n>=5){ localStorage.setItem("dz-admin-block", String(Date.now()+ 60*1000)); setErr("محاولات كثيرة — تم الحظر 60 ثانية"); }
      else setErr(`كلمة المرور غير صحيحة (${n}/5)`);
    }
  };
  return (
    <div className="fade-in" style={{padding:22,minHeight:"calc(100vh - 28px)",display:"flex",flexDirection:"column"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18}}>
        <div style={{width:34,height:34,borderRadius:11,background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center"}}><Store size={16} color="#fff" /></div>
        <div><div style={{fontWeight:800,fontSize:13.5,lineHeight:1}}>متجري</div><div className="mono" style={{fontSize:10,color:"var(--muted)",letterSpacing:.6}}>ADMIN / DZ-STORE</div></div>
      </div>
      <div style={{background:"var(--ink)",color:"#fff",borderRadius:18,padding:18,position:"relative",overflow:"hidden",marginBottom:18}}>
        <div className="grid-pattern" style={{position:"absolute",inset:0,opacity:.12}}/>
        <div style={{position:"relative",display:"flex",gap:12,alignItems:"flex-start"}}>
          <div style={{width:38,height:38,borderRadius:12,background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Lock size={16} color="#fff"/></div>
          <div>
            <div style={{fontWeight:800,fontSize:15}}>دخول البائع</div>
            <div style={{fontSize:12.5,opacity:.75,lineHeight:1.7,marginTop:4}}>مساحة محمية. لن يراها الزبائن. أدخل كلمة المرور للوصول إلى الطلبات والمنتجات.</div>
            <div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.14)",borderRadius:20,padding:"5px 10px",fontSize:11}}><ShieldCheck size={12}/> محمي بكلمة مرور</div>
          </div>
        </div>
      </div>
      <form onSubmit={submit} style={{background:"#F8FAFC",border:"1px solid var(--line)",borderRadius:18,padding:16}}>
        <label style={{fontSize:11.5,fontWeight:700,color:"var(--muted)",letterSpacing:.3}}>كلمة المرور</label>
        <div style={{marginTop:8,position:"relative"}}>
          <input autoFocus type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" style={{width:"100%",padding:"13px 14px 13px 40px",borderRadius:12,border:"1px solid var(--line)",background:"#fff",fontSize:14}}/>
          <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--muted-2)"}}><Lock size={16}/></div>
        </div>
        {err && <div style={{marginTop:10,background:"var(--red-soft)",border:"1px solid #FECACA",color:"var(--red)",fontSize:12.5,fontWeight:700,borderRadius:10,padding:"9px 11px"}}>{err}</div>}
        {IS_DEFAULT_PW && <div className="mono" style={{marginTop:10,color:"#94A3B8",fontSize:11}}>الافتراضية: <b style={{color:"var(--ink)"}}>{ADMIN_PASSWORD}</b> — غيّرها عبر <code style={{background:"#fff",border:"1px solid var(--line)",padding:"2px 6px",borderRadius:6}}>VITE_ADMIN_PASSWORD</code></div>}
        <button type="submit" style={{width:"100%",marginTop:14,background:"var(--red)",color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontWeight:800,fontSize:14,cursor:"pointer",boxShadow:"0 8px 20px rgba(215,48,59,.25)"}}>دخول آمن →</button>
        <button type="button" onClick={()=>navigate("/")} style={{width:"100%",marginTop:8,background:"#fff",border:"1px solid var(--line)",borderRadius:12,padding:"11px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>العودة للمتجر</button>
      </form>
      <div style={{marginTop:"auto",paddingTop:16,display:"flex",alignItems:"center",justifyContent:"center",gap:6,color:"var(--muted-2)",fontSize:11}}><Sparkles size={12}/> واجهة بائع احترافية</div>
    </div>
  );
}

function Storefront({products,placeOrder,lang,setLang,t}){
  const [selected,setSelected]=useState(null);
  const [ordering,setOrdering]=useState(false);
  const [confirmed,setConfirmed]=useState(null);
  // Stock moves under us (this tab's own orders, or another tab). Always render the live row, not the captured one.
  const live = selected ? products.find(p=>p.id===selected.id)||null : null;
  useEffect(()=>{ if(selected && !live){ setSelected(null); setOrdering(false) } },[selected,live]);
  const submit=async(payload)=>{
    const order=await placeOrder(payload); // rejects on gone/out-of-stock/full storage — OrderForm shows it
    setConfirmed(order); setOrdering(false); setSelected(null);
  };
  if(confirmed) return <OrderConfirmed order={confirmed} onClose={()=>setConfirmed(null)} t={t} lang={lang} />;
  if(ordering && live) return <OrderForm product={live} onBack={()=>setOrdering(false)} onSubmit={submit} t={t} lang={lang} />;
  if(live) return <ProductDetail product={live} onBack={()=>setSelected(null)} onOrder={()=>setOrdering(true)} t={t} lang={lang} />;
  return (
    <div className="fade-in" style={{paddingBottom:14}}>
      <div style={{position:"sticky",top:0,zIndex:20,background:"var(--red)",borderBottom:"1px solid var(--red-2)",boxShadow:"0 2px 10px rgba(0,0,0,.12)",padding:"11px 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:30,height:30,background:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}><Store size={15} color="var(--red)"/></div>
        <div style={{fontWeight:800,fontSize:15,letterSpacing:-.2,color:"#fff"}}>{t("banner")}</div>
        <button onClick={()=>setLang(lang==="ar"?"en":"ar")} style={{marginInlineStart:"auto",background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"#fff",borderRadius:20,padding:"5px 10px",fontSize:11,fontWeight:800,cursor:"pointer"}}>{lang==="ar"?"EN":"AR"}</button>
      </div>
      <div style={{padding:"14px 14px 0",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {products.map(p=> <ProductCard key={p.id} p={p} onClick={()=>setSelected(p)} t={t} lang={lang} />)}
        {products.length===0 && <div style={{gridColumn:"1/3",border:"1px dashed var(--line)",padding:22,textAlign:"center",color:varMuted,fontSize:13}}>{t("empty")}</div>}
      </div>
    </div>
  );
}
const varMuted="#7A7F87";
function ProductCard({p,onClick,t,lang}){
  const stock=Number(p.quantity)||0, out=stock<=0;
  return (
    <button onClick={onClick} disabled={out} style={{textAlign: lang==="ar"?"right":"left",background:"#fff",border:"1px solid var(--line)",overflow:"hidden",padding:0,cursor:out?"not-allowed":"pointer",display:"flex",flexDirection:"column",transition:"border-color .15s ease"}}>
      <div style={{width:"100%",aspectRatio:"1/1",background:`#F3F3F0 ${cssUrl(p.img)} center/cover`,borderBottom:"1px solid var(--line)",position:"relative"}}>
        {out && <div style={{position:"absolute",inset:0,background:"rgba(255,255,255,.66)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{background:"var(--ink)",color:"#fff",fontSize:10.5,fontWeight:800,padding:"4px 9px",borderRadius:20}}>{t("outOfStock")}</span></div>}
      </div>
      <div style={{padding:"10px 10px 11px",flex:1,display:"flex",flexDirection:"column",gap:6,opacity:out?.5:1}}>
        <div style={{fontWeight:600,fontSize:13,lineHeight:1.35,color:"var(--ink)",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden",minHeight:34,letterSpacing:-.1}}>{p.name}</div>
        <div style={{marginTop:"auto",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,borderTop:"1px solid var(--line-2)",paddingTop:8}}>
          <div style={{display:"flex",alignItems:"baseline",gap:4}}>
            <span style={{color:"var(--ink)",fontWeight:800,fontSize:14.5,letterSpacing:-.2}}>{riyal(p.price, lang)}</span>
          </div>
          <span style={{fontSize:10,fontWeight:700,letterSpacing:.6,color:varMuted,border:"1px solid var(--line)",padding:"3px 6px"}}>{out?t("outOfStock"):t("view")}</span>
        </div>
      </div>
    </button>
  );
}

function ProductDetail({product,onBack,onOrder,t,lang}){
  const stock=Number(product.quantity)||0, out=stock<=0;
  return (
    <div className="fade-in" style={{paddingBottom:88}}>
      <div style={{position:"sticky",top:0,zIndex:5,background:"rgba(255,255,255,.9)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--line)",padding:"10px 12px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{width:34,height:34,borderRadius:11,background:"#fff",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ArrowRight size={15} color="var(--ink)" style={{transform: lang==="ar"?"scaleX(-1)":"none"}}/></button>
        <span style={{fontWeight:800,fontSize:13}}>{t("detail")}</span>
        <span className="mono" style={{marginInlineStart:"auto",fontSize:11,color:varMuted,background:"#F8FAFC",border:"1px solid var(--line)",padding:"4px 8px",borderRadius:20}}>{product.id.toUpperCase()}</span>
      </div>
      <div style={{padding:14}}>
        <div style={{background:"var(--sky-2)",border:"1px solid var(--line)",borderRadius:20,padding:10}}>
          <div style={{width:"100%",aspectRatio:"1/1",borderRadius:14,background:`#fff ${cssUrl(product.img)} center/cover`,border:"1px solid var(--line)"}}/>
        </div>
        <div style={{marginTop:14}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:10}}>
            <h1 style={{margin:0,fontSize:22,fontWeight:800,letterSpacing:-.5,lineHeight:1.25}}>{product.name}</h1>
            <span style={{background:out?"#F1F5F9":"var(--red-soft)",border:out?"1px solid var(--line)":"1px solid #FECACA",color:out?varMuted:"var(--red)",fontSize:11,fontWeight:800,padding:"5px 9px",borderRadius:20,whiteSpace:"nowrap"}}>{out?t("outOfStock"):t("stockLeft",stock)}</span>
          </div>
          <div style={{marginTop:8,display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{fontSize:26,fontWeight:800,letterSpacing:-.6}}>{riyal(product.price, lang)}</span>
          </div>
          <div style={{marginTop:12,background:"#F8FAFC",border:"1px solid var(--line)",borderRadius:14,padding:12,display:"flex",gap:8}}>
            <div style={{width:28,height:28,borderRadius:10,background:"var(--sky)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><Sparkles size={14} color="var(--ink)"/></div>
            <p style={{margin:0,color:"#334155",fontSize:13.2,lineHeight:1.9}}>{product.desc}</p>
          </div>
        </div>
      </div>
      <div style={{position:"fixed",maxWidth:440,width:"100%",bottom:14,padding:"0 14px",boxSizing:"border-box"}}>
        <div style={{background:"var(--ink)",borderRadius:16,padding:10,display:"flex",gap:10,alignItems:"center",boxShadow:"0 16px 30px rgba(12,14,11,.22)",border:"1px solid #1e211e"}}>
          <div style={{flex:1,paddingInlineStart:6}}>
            <div style={{color:"#fff",fontWeight:800,fontSize:13,lineHeight:1}}>{out?t("outOfStock"):t("orderNow")}</div>
            <div style={{color:"#94A3B8",fontSize:11,marginTop:2}}>{out?"—":t("confirmPhone")}</div>
          </div>
          <button onClick={onOrder} disabled={out} style={{background:out?"#4b4f4b":"var(--red)",color:"#fff",border:"none",borderRadius:12,padding:"13px 18px",fontWeight:800,fontSize:14,cursor:out?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:8,whiteSpace:"nowrap"}}>{t("continueOrder")} <ArrowRight size={14} style={{transform: lang==="ar"?"rotate(180deg)":"none"}}/></button>
        </div>
      </div>
    </div>
  );
}

function OrderForm({product,onBack,onSubmit,t,lang}){
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [phone,setPhone]=useState("");
  const [wilaya,setWilaya]=useState("");
  const [delivery,setDelivery]=useState("مكتب");
  const [qty,setQty]=useState(1);
  const [hp,setHp]=useState("");
  const [capInput,setCapInput]=useState("");
  const [cap]=useState(()=>{const a=2+Math.floor(Math.random()*6); const b=3+Math.floor(Math.random()*6); return {a,b,ans:a+b}});
  const [error,setError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const stock=Number(product.quantity)||0;
  const maxQty=Math.max(1,Math.min(10,stock));
  useEffect(()=>{ setQty(q=>Math.min(q,maxQty)) },[maxQty]);
  const submit=async()=>{
    if(submitting) return;
    if(hp.trim()!=="") return setError(t("errBot"));
    const fn=sanitize(firstName), ln=sanitize(lastName);
    if(!fn || !ln) return setError(t("errName"));
    if(fn.length<2 || ln.length<2) return setError(t("errShort"));
    if(!/^0[5-7][0-9]{8}$/.test(phone.trim())) return setError(t("errPhone"));
    if(!wilaya) return setError(t("errWilaya"));
    if(Number(capInput)!==cap.ans) return setError(`${t("human")}: ${cap.a} + ${cap.b} = ?`);
    if(qty>stock) return setError(t("errStock",stock));
    const rl=canPlaceOrder();
    if(!rl.ok) return setError(t("errWait", rl.wait));
    if(isDuplicateOrder(phone.trim(), product.id)) return setError(t("errDup"));
    setError(""); setSubmitting(true);
    try{
      await onSubmit({productId:product.id,productName:product.name,price:product.price,qty,total:product.price*qty,firstName:fn,lastName:ln,phone:phone.trim(),wilaya,delivery});
      recordOrder(); // only after it actually persisted — a failed save shouldn't burn the cooldown
    }catch(e){
      setError(e.message==="GONE"?t("errGone") : e.message==="STOCK"?t("errStock",e.left) : t("errStorage"));
      setSubmitting(false);
    }
  };
  const inputStyle={width:"100%",padding:"12px 13px",borderRadius:12,border:"1px solid var(--line)",background:"#F8FAFC",fontSize:13.5,boxSizing:"border-box"};
  const labelStyle={fontSize:11,fontWeight:700,color:"#475569",letterSpacing:.2,marginBottom:6,display:"block"};
  return (
    <div className="fade-in" style={{paddingBottom:120}}>
      <div style={{position:"sticky",top:0,zIndex:5,background:"rgba(255,255,255,.9)",backdropFilter:"blur(10px)",borderBottom:"1px solid var(--line)",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
        <button onClick={onBack} style={{width:32,height:32,borderRadius:11,background:"#fff",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><ArrowRight size={14} style={{transform: lang==="ar"?"scaleX(-1)":"none"}}/></button>
        <div style={{fontWeight:800,fontSize:13}}>{t("orderInfo")}</div>
      </div>
      <div style={{padding:14,display:"flex",gap:6,alignItems:"center"}}>
        <span style={{flex:1,height:4,borderRadius:20,background:"var(--ink)"}}/><span style={{flex:1,height:4,borderRadius:20,background:"var(--ink)"}}/><span style={{flex:1,height:4,borderRadius:20,background:"#E2E8F0"}}/>
      </div>
      <div style={{padding:"0 14px"}}>
        <div style={{background:"#fff",border:"1px solid var(--line)",borderRadius:16,padding:12,display:"flex",gap:10,alignItems:"center",boxShadow:"var(--shadow-card)"}}>
          <div style={{width:54,height:54,borderRadius:12,background:`#fff ${cssUrl(product.img)} center/cover`,border:"1px solid var(--line)",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:800,fontSize:13}}>{product.name}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:4,marginTop:2}}><span style={{color:"var(--red)",fontWeight:800,fontSize:13}}>{riyal(product.price, lang)}</span><span style={{color:varMuted,fontSize:11}}>× {qty}</span></div>
            <div className="mono" style={{color:varMuted,fontSize:10.5,marginTop:2}}>{t("stockLeft",stock)}</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,background:"var(--ink)",borderRadius:12,padding:"6px 8px",color:"#fff"}}>
            <button onClick={()=>setQty(q=>Math.min(maxQty,q+1))} disabled={qty>=maxQty} style={{width:26,height:26,borderRadius:8,border:"1px solid #2a2e2a",background:"#1a1d1a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:qty>=maxQty?"not-allowed":"pointer",opacity:qty>=maxQty?.45:1}}><Plus size={12}/></button>
            <span className="mono" style={{fontWeight:800,fontSize:12,minWidth:18,textAlign:"center"}}>{String(qty).padStart(2,"0")}</span>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:26,height:26,borderRadius:8,border:"1px solid #2a2e2a",background:"#1a1d1a",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Minus size={12}/></button>
          </div>
        </div>
        <div style={{marginTop:14,background:"#F8FAFC",border:"1px solid var(--line)",borderRadius:16,padding:14}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={labelStyle}>{t("firstName")}</label><input style={inputStyle} value={firstName} onChange={e=>setFirstName(e.target.value)} placeholder=""/></div>
            <div><label style={labelStyle}>{t("lastName")}</label><input style={inputStyle} value={lastName} onChange={e=>setLastName(e.target.value)} placeholder=""/></div>
          </div>
          <div style={{marginTop:10}}><label style={labelStyle}>{t("phone")}</label><input style={{...inputStyle,background:"#fff",direction:"ltr",textAlign:"left"}} value={phone} onChange={e=>setPhone(e.target.value)} placeholder="" type="tel"/></div>
          <div style={{marginTop:10}}><label style={labelStyle}>{t("wilaya")}</label><select style={{...inputStyle,background:"#fff"}} value={wilaya} onChange={e=>setWilaya(e.target.value)}><option value="">{t("choose")}</option>{WILAYAS.map(w=><option key={w} value={w}>{w}</option>)}</select></div>
          <div style={{marginTop:12}}><label style={labelStyle}>{t("delivery")}</label>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setDelivery("مكتب")} style={{flex:1,padding:12,borderRadius:12,border:delivery==="مكتب"?"1.5px solid var(--red)":"1px solid var(--line)",background:delivery==="مكتب"?"var(--red-soft)":"#fff",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign: lang==="ar"?"right":"left"}}>
                <div style={{width:30,height:30,borderRadius:9,background:delivery==="مكتب"?"var(--red)":"var(--sky-2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Building2 size={14} color={delivery==="مكتب"?"#fff":"var(--ink)"}/></div>
                <div style={{fontWeight:800,fontSize:12.5}}>{t("office")}</div>
                {delivery==="مكتب" && <Check size={14} color="var(--red)" style={{marginInlineStart:"auto"}}/>}
              </button>
              <button onClick={()=>setDelivery("منزل")} style={{flex:1,padding:12,borderRadius:12,border:delivery==="منزل"?"1.5px solid var(--red)":"1px solid var(--line)",background:delivery==="منزل"?"var(--red-soft)":"#fff",display:"flex",alignItems:"center",gap:10,cursor:"pointer",textAlign: lang==="ar"?"right":"left"}}>
                <div style={{width:30,height:30,borderRadius:9,background:delivery==="منزل"?"var(--red)":"var(--sky-2)",display:"flex",alignItems:"center",justifyContent:"center"}}><Truck size={14} color={delivery==="منزل"?"#fff":"var(--ink)"}/></div>
                <div style={{fontWeight:800,fontSize:12.5}}>{t("home")}</div>
                {delivery==="منزل" && <Check size={14} color="var(--red)" style={{marginInlineStart:"auto"}}/>}
              </button>
            </div>
          </div>
          <div style={{position:"absolute",left:"-9999px",top:"auto",width:1,height:1,overflow:"hidden"}} aria-hidden="true">
            <input tabIndex={-1} autoComplete="off" value={hp} onChange={e=>setHp(e.target.value)} placeholder="website" />
          </div>
          <div style={{marginTop:12,background:"#fff",border:"1px solid var(--line)",borderRadius:12,padding:10,display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:30,height:30,borderRadius:8,background:"var(--ink)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{cap.a}+{cap.b}</div>
            <div style={{flex:1}}>
              <label style={{...labelStyle,marginBottom:4}}>{t("human")}: {cap.a} + {cap.b} = ?</label>
              <input inputMode="numeric" style={{...inputStyle,background:"#fff",padding:"10px 12px"}} value={capInput} onChange={e=>setCapInput(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder={t("result")} />
            </div>
            <ShieldCheck size={16} color={varMuted}/>
          </div>
          {error && <div style={{marginTop:12,background:"var(--red-soft)",border:"1px solid #FECACA",color:"var(--red)",fontSize:12.5,fontWeight:700,borderRadius:12,padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}><X size={14}/>{error}</div>}
        </div>
      </div>
      <div style={{position:"fixed",maxWidth:440,width:"100%",bottom:0,padding:12,background:"rgba(255,255,255,.96)",backdropFilter:"blur(10px)",borderTop:"1px solid var(--line)",boxSizing:"border-box",borderRadius:"16px 16px 0 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,padding:"0 2px"}}>
          <span style={{fontSize:12.5,color:varMuted,fontWeight:600}}>{t("total")}</span>
          <span style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{fontWeight:800,fontSize:18}}>{riyal(product.price*qty, lang)}</span><span className="mono" style={{fontSize:11,color:varMuted,background:"#F1F5F9",border:"1px solid var(--line)",padding:"2px 6px",borderRadius:20}}>COD</span></span>
        </div>
        <button disabled={submitting} onClick={submit} style={{width:"100%",background:submitting?"#9AA3AF":"var(--red)",color:"#fff",border:"none",borderRadius:12,padding:"14px 0",fontWeight:800,fontSize:14.5,cursor:submitting?"not-allowed":"pointer",opacity:submitting?0.7:1,boxShadow:submitting?"none":"0 10px 22px rgba(215,48,59,.28)"}}>{submitting?t("sending"):t("confirm")}</button>
      </div>
    </div>
  );
}

function OrderConfirmed({order,onClose,t,lang}){
  const navigate=useNavigate();
  const handle=()=>{ onClose(); navigate("/") };
  return (
    <div style={{minHeight:"calc(100vh - 28px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:22,textAlign:"center"}} className="fade-in">
      <div style={{width:72,height:72,borderRadius:20,background:"var(--ink)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",boxShadow:"0 14px 30px rgba(12,14,11,.18)"}}>
        <div style={{width:52,height:52,borderRadius:14,background:"var(--red)",display:"flex",alignItems:"center",justifyContent:"center"}}><Check size={26} color="#fff" strokeWidth={3}/></div>
        <div style={{position:"absolute",top:-6,left:-6,background:"var(--sky)",border:"1px solid var(--sky-3)",borderRadius:20,padding:"4px 7px",fontSize:10,fontWeight:800}}>✓ OK</div>
      </div>
      <h2 style={{margin:"16px 0 6px",fontSize:20,fontWeight:800,letterSpacing:-.4}}>{t("successTitle")}</h2>
      <p style={{margin:0,color:"#475569",fontSize:13,lineHeight:1.9,maxWidth:280}}>{t("successMsg")}</p>
      <div style={{marginTop:14,background:"#F8FAFC",border:"1px solid var(--line)",borderRadius:14,padding:12,width:"100%",maxWidth:320,display:"flex",alignItems:"center",gap:10,textAlign: lang==="ar"?"right":"left"}}>
        <div style={{width:32,height:32,borderRadius:10,background:"var(--sky)",display:"flex",alignItems:"center",justifyContent:"center"}}><ClipboardList size={14}/></div>
        <div style={{flex:1}}>
          <div style={{fontWeight:800,fontSize:12.5}}>{t("orderNo")}</div>
          <div className="mono" style={{fontSize:11.5,color:"var(--ink)",direction:"ltr",textAlign:"left"}}>{order?.id?.toUpperCase()}</div>
        </div>
        <span style={{background:"#fff",border:"1px solid var(--line)",padding:"5px 8px",borderRadius:20,fontSize:11,fontWeight:700}}>COD</span>
      </div>
      <button onClick={handle} style={{marginTop:16,background:"var(--ink)",color:"#fff",border:"none",borderRadius:12,padding:"12px 20px",fontWeight:800,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8}}>{t("continueShop")} <ArrowRight size={14} style={{transform: lang==="ar"?"rotate(180deg)":"none"}}/></button>
    </div>
  );
}

function Dashboard({products,saveProducts,orders,commit}){
  const navigate=useNavigate();
  const [tab,setTab]=useState("orders");
  const [orderFilter,setOrderFilter]=useState("pending");
  const [showAdd,setShowAdd]=useState(false);
  const [editing,setEditing]=useState(null);
  const [confirmDel,setConfirmDel]=useState(null);
  const [err,setErr]=useState("");
  const removeProduct=async(id)=>{ setConfirmDel(null); try{ await saveProducts(products.filter(p=>p.id!==id)) }catch(e){ setErr(isQuotaError(e)?"مساحة التخزين ممتلئة":"تعذر الحفظ") } };
  const addProduct=async(p)=>{ await saveProducts([{...p,id:"p"+Date.now()},...products]); setShowAdd(false) };
  const updateProduct=async(updated)=>{ await saveProducts(products.map(p=>p.id===updated.id?updated:p)); setEditing(null) };
  // Stock was deducted at order time, so canceling has to give it back — and reopening has to take it again.
  const setStatus=async(id,s)=>{
    const freshOrders=(await storageGet("dz-store-orders"))||orders;
    const freshProducts=(await storageGet("dz-store-products"))||products;
    const cur=freshOrders.find(o=>o.id===id);
    if(!cur || cur.status===s) return;
    const wasCanceled=cur.status==="ملغى", nowCanceled=s==="ملغى";
    const shift = wasCanceled===nowCanceled ? 0 : (nowCanceled ? cur.qty : -cur.qty);
    const nextProducts = shift===0 ? null : freshProducts.map(p=>p.id===cur.productId?{...p,quantity:Math.max(0,(Number(p.quantity)||0)+shift)}:p);
    try{ await commit(freshOrders.map(o=>o.id===id?{...o,status:s}:o), nextProducts) }
    catch(e){ setErr(isQuotaError(e)?"مساحة التخزين ممتلئة":"تعذر الحفظ") }
  };
  const logout=()=>{ localStorage.removeItem("dz-admin-auth"); navigate("/admin/login",{replace:true}) };
  const pending=orders.filter(o=>o.status==="قيد الانتظار");
  const confirmed=orders.filter(o=>o.status==="مؤكد");
  const canceled=orders.filter(o=>o.status==="ملغى");
  const delivered=orders.filter(o=>o.status==="تم التوصيل");
  const collected=delivered.reduce((a,b)=>a+b.total,0);
  const expected=[...pending,...confirmed].reduce((a,b)=>a+b.total,0);
  const filteredOrders = orderFilter==="pending"?pending : orderFilter==="confirmed"?confirmed : orderFilter==="canceled"?canceled : orderFilter==="delivered"?delivered : orders;
  return (
    <div style={{minHeight:"calc(100vh - 28px)",paddingBottom:20}} className="fade-in">
      <div style={{background:"var(--ink)",padding:"14px 14px 12px",position:"sticky",top:0,zIndex:5}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>navigate("/")} style={{width:32,height:32,borderRadius:10,background:"#fff",border:"none",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Store size={14} color="var(--ink)"/></button>
            <div>
              <div style={{color:"#fff",fontWeight:800,fontSize:14,lineHeight:1}}>لوحة التحكم</div>
              <div className="mono" style={{color:"#94A3B8",fontSize:10,letterSpacing:.6}}>SELLER · PRIVATE</div>
            </div>
          </div>
          <button onClick={logout} style={{background:"rgba(255,255,255,.08)",border:"1px solid rgba(255,255,255,.14)",color:"#fff",borderRadius:10,padding:"7px 10px",display:"flex",alignItems:"center",gap:6,fontSize:12,fontWeight:700,cursor:"pointer"}}><LogOut size={13}/> خروج</button>
        </div>
        <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
          <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:10}}>
            <div className="mono" style={{color:"#94A3B8",fontSize:10,letterSpacing:.6}}>PENDING</div><div style={{color:"#fff",fontWeight:800,fontSize:18,marginTop:2}}>{pending.length}</div><div style={{color:"#CBD5E1",fontSize:11}}>قيد الانتظار</div>
          </div>
          <div style={{background:"rgba(255,255,255,.06)",border:"1px solid rgba(255,255,255,.1)",borderRadius:14,padding:10}}>
            <div className="mono" style={{color:"#94A3B8",fontSize:10,letterSpacing:.6}}>CONFIRMED</div><div style={{color:"#fff",fontWeight:800,fontSize:18,marginTop:2}}>{confirmed.length}</div><div style={{color:"#CBD5E1",fontSize:11}}>مؤكد</div>
          </div>
          <div style={{background:"var(--red)",borderRadius:14,padding:10}}>
            <div className="mono" style={{color:"rgba(255,255,255,.85)",fontSize:10,letterSpacing:.6}}>COLLECTED</div><div style={{color:"#fff",fontWeight:800,fontSize:14,marginTop:2}}>{riyal(collected)}</div><div style={{color:"rgba(255,255,255,.8)",fontSize:11}}>محصّل · منتظر {riyal(expected)}</div>
          </div>
        </div>
        {err && <div style={{marginTop:10,background:"var(--red-soft)",border:"1px solid #FECACA",color:"var(--red)",fontSize:12,fontWeight:700,borderRadius:10,padding:"8px 10px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>{err}<button onClick={()=>setErr("")} style={{background:"none",border:"none",cursor:"pointer",color:"var(--red)",display:"flex"}}><X size={13}/></button></div>}
      </div>
      <div style={{padding:"12px 14px 0"}}>
        <div style={{background:"#F1F5F9",border:"1px solid var(--line)",padding:4,borderRadius:14,display:"flex",gap:4}}>
          <TabBtn active={tab==="orders"} onClick={()=>setTab("orders")} icon={<ClipboardList size={13}/>} label={`الطلبات · ${orders.length}`} />
          <TabBtn active={tab==="products"} onClick={()=>setTab("products")} icon={<Package size={13}/>} label={`المنتجات · ${products.length}`} />
        </div>
      </div>
      {tab==="orders" ? (
        <div style={{padding:"10px 14px"}}>
          <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:4,scrollbarWidth:"none"}}>
            {[
              {id:"pending",label:`قيد الانتظار · ${pending.length}`},
              {id:"confirmed",label:`مؤكد · ${confirmed.length}`},
              {id:"canceled",label:`ملغى · ${canceled.length}`},
              {id:"delivered",label:`تم التوصيل · ${delivered.length}`},
              {id:"all",label:`الكل · ${orders.length}`},
            ].map(f=>(
              <button key={f.id} onClick={()=>setOrderFilter(f.id)} style={{whiteSpace:"nowrap",padding:"7px 12px",borderRadius:20,fontSize:11,fontWeight:800,border:orderFilter===f.id?"1px solid var(--ink)":"1px solid var(--line)",background:orderFilter===f.id?"var(--ink)":"#fff",color:orderFilter===f.id?"#fff":"#475569",cursor:"pointer"}}>{f.label}</button>
            ))}
          </div>
          <div style={{marginTop:10}}>
            {filteredOrders.length===0 && <div style={{background:"#F8FAFC",border:"1px dashed var(--line)",borderRadius:14,padding:24,textAlign:"center",color:varMuted,fontSize:13}}>لا توجد طلبات في هذا القسم</div>}
            {filteredOrders.map(o=><OrderCard key={o.id} order={o} setStatus={setStatus} />)}
          </div>
        </div>
      ):(
        <div style={{padding:"10px 14px"}}>
          <button onClick={()=>setShowAdd(true)} style={{width:"100%",background:"#fff",border:"1.5px dashed var(--red)",color:"var(--red)",fontWeight:800,fontSize:13,borderRadius:14,padding:"12px 0",display:"flex",alignItems:"center",justifyContent:"center",gap:7,cursor:"pointer"}}><Plus size={15}/> إضافة منتج جديد</button>
          <div style={{marginTop:10,display:"grid",gap:8}}>
            {products.map(p=>(
              <div key={p.id} style={{display:"flex",gap:10,alignItems:"center",background:"#fff",border:"1px solid var(--line)",borderRadius:14,padding:10,boxShadow:"var(--shadow-card)"}}>
                <div style={{width:56,height:56,borderRadius:11,background:`#fff ${cssUrl(p.img)} center/cover`,border:"1px solid var(--line)",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginTop:3}}>
                    <span style={{color:"var(--red)",fontWeight:800,fontSize:12}}>{riyal(p.price)}</span>
                    <span style={{background: p.quantity<=5?"#FECACA":"#E0F2FE",color:p.quantity<=5?"#B91C1C":"#0C4A6E",fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,border:"1px solid var(--line)"}} className="mono">مخزون: {p.quantity ?? 0}</span>
                  </div>
                </div>
                {confirmDel===p.id ? (
                  <div style={{display:"flex",gap:6,alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"var(--red)"}}>حذف؟</span>
                    <button onClick={()=>removeProduct(p.id)} style={{height:34,padding:"0 10px",borderRadius:10,background:"var(--red)",border:"none",color:"#fff",fontWeight:800,fontSize:11.5,cursor:"pointer"}}>نعم</button>
                    <button onClick={()=>setConfirmDel(null)} style={{height:34,padding:"0 10px",borderRadius:10,background:"#fff",border:"1px solid var(--line)",fontWeight:700,fontSize:11.5,cursor:"pointer"}}>لا</button>
                  </div>
                ):(
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>setEditing(p)} style={{width:34,height:34,borderRadius:10,background:"#F8FAFC",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Pencil size={14} color="var(--ink)"/></button>
                    <button onClick={()=>setConfirmDel(p.id)} style={{width:34,height:34,borderRadius:10,background:"#FFF1F2",border:"1px solid #FECACA",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Trash2 size={14} color="var(--red)"/></button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {showAdd && <AddProductModal onClose={()=>setShowAdd(false)} onAdd={addProduct} />}
      {editing && <EditProductModal product={editing} onClose={()=>setEditing(null)} onSave={updateProduct} />}
    </div>
  );
}
function TabBtn({active,onClick,icon,label}){
  return <button onClick={onClick} style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"9px 0",borderRadius:10,border:active?"1px solid #1a1d19":"1px solid transparent",background:active?"var(--ink)":"transparent",color:active?"#fff":"#64748B",fontWeight:800,fontSize:12,cursor:"pointer"}}>{icon}{label}</button>;
}
const STATUS_COLOR={"قيد الانتظار":"#F59E0B","مؤكد":"#16A34A","تم التوصيل":"#0C0E0B","ملغى":"#D7303B"};
function OrderCard({order,setStatus}){
  const s=order.status;
  return (
    <div style={{background:"#fff",border:"1px solid var(--line)",borderRadius:16,padding:12,marginBottom:10,boxShadow:"var(--shadow-card)"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"flex-start"}}>
        <div>
          <div style={{fontWeight:800,fontSize:13.5,display:"flex",alignItems:"center",gap:6}}>{order.firstName} {order.lastName} <span style={{width:6,height:6,borderRadius:20,background:STATUS_COLOR[s],display:"inline-block"}}/></div>
          <div className="mono" style={{color:varMuted,fontSize:11,marginTop:2,direction:"ltr",textAlign:"right"}}>{order.phone} · {new Date(order.createdAt).toLocaleDateString("en-DZ")}</div>
        </div>
        <span style={{fontSize:11,fontWeight:800,color:"#fff",background:STATUS_COLOR[s],borderRadius:20,padding:"4px 9px",whiteSpace:"nowrap"}}>{s}</span>
      </div>
      <div style={{marginTop:10,background:"#F8FAFC",border:"1px solid var(--line)",borderRadius:12,padding:10}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:10,alignItems:"center"}}>
          <div style={{fontSize:12.5,fontWeight:700}}>{order.productName} <span style={{color:varMuted,fontWeight:600}}>× {order.qty}</span></div>
          <b style={{color:"var(--red)",fontSize:12.5}}>{riyal(order.total)}</b>
        </div>
        <div className="mono" style={{marginTop:6,color:varMuted,fontSize:11,display:"flex",gap:6,flexWrap:"wrap"}}>
          <span style={{background:"#fff",border:"1px solid var(--line)",padding:"3px 7px",borderRadius:20}}>{order.wilaya}</span>
          <span style={{background:"#fff",border:"1px solid var(--line)",padding:"3px 7px",borderRadius:20}}>{order.delivery==="مكتب"?"مكتب":"منزل"}</span>
        </div>
      </div>
      {s==="قيد الانتظار" && (
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={()=>setStatus(order.id,"مؤكد")} style={{flex:1,background:"#16A34A",color:"#fff",border:"none",borderRadius:10,padding:"9px 0",fontWeight:800,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><Check size={13}/> تأكيد الطلب</button>
          <button onClick={()=>setStatus(order.id,"ملغى")} style={{flex:1,background:"#fff",border:"1px solid #FECACA",color:"var(--red)",borderRadius:10,padding:"9px 0",fontWeight:800,fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}><X size={13}/> إلغاء</button>
        </div>
      )}
      {s==="مؤكد" && (
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={()=>setStatus(order.id,"تم التوصيل")} style={{flex:1,background:"var(--ink)",color:"#fff",border:"none",borderRadius:10,padding:"9px 0",fontWeight:800,fontSize:12,cursor:"pointer"}}>تم التوصيل ✓</button>
          <button onClick={()=>setStatus(order.id,"ملغى")} style={{flex:1,background:"#fff",border:"1px solid #FECACA",color:"var(--red)",borderRadius:10,padding:"9px 0",fontWeight:800,fontSize:12,cursor:"pointer"}}>إلغاء المؤكد</button>
        </div>
      )}
      {s==="ملغى" && (
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <button onClick={()=>setStatus(order.id,"قيد الانتظار")} style={{flex:1,background:"#fff",border:"1px solid var(--line)",borderRadius:10,padding:"9px 0",fontWeight:700,fontSize:12,cursor:"pointer"}}>إعادة فتح</button>
          <span style={{flex:1,background:"#F8FAFC",border:"1px dashed var(--line)",borderRadius:10,padding:"9px 0",textAlign:"center",fontSize:11,color:varMuted}}>ملغى</span>
        </div>
      )}
      {s==="تم التوصيل" && (
        <div style={{display:"flex",gap:8,marginTop:10}}>
          <span style={{flex:1,background:"#F0FDF4",border:"1px solid #BBF7D0",color:"#166534",borderRadius:10,padding:"9px 0",textAlign:"center",fontWeight:800,fontSize:12}}>✓ تم التوصيل</span>
          <button onClick={()=>setStatus(order.id,"مؤكد")} style={{background:"#fff",border:"1px solid var(--line)",borderRadius:10,padding:"9px 12px",fontWeight:700,fontSize:12,cursor:"pointer"}}>تراجع</button>
        </div>
      )}
    </div>
  );
}

function fieldStyle(){ return {width:"100%",padding:"11px 13px",borderRadius:12,border:"1px solid var(--line)",background:"#F8FAFC",fontSize:13.5,boxSizing:"border-box"}; }

function AddProductModal({onClose,onAdd}){
  const [name,setName]=useState(""); const [price,setPrice]=useState(""); const [desc,setDesc]=useState(""); const [quantity,setQuantity]=useState(""); const [img,setImg]=useState(""); const [preview,setPreview]=useState(""); const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const handleFile=async(e)=>{
    const file=e.target.files?.[0]; if(!file) return;
    if(!file.type.startsWith("image/")) return setErr("اختر صورة فقط");
    if(file.size> 12*1024*1024) return setErr("حجم الصورة كبير (max 12MB)");
    setBusy(true);
    try{ const d=await shrinkImage(file); setImg(d); setPreview(d); setErr("") }
    catch{ setErr("تعذر قراءة الصورة") }
    finally{ setBusy(false); e.target.value="" } // let the same file be re-picked after a failure
  };
  const submit=async()=>{
    if(busy) return;
    if(!name.trim()||!price) return setErr("أدخل الاسم والسعر");
    if(!img) return setErr("حمّل صورة المنتج");
    setBusy(true);
    try{ await onAdd({name,price:Number(price),quantity:Number(quantity)||0,desc,img}) }
    catch(e){ setErr(isQuotaError(e)?"مساحة التخزين ممتلئة — احذف منتجات قديمة":"تعذر حفظ المنتج"); setBusy(false) }
  };
  const s=fieldStyle();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,14,11,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",zIndex:50}}>
      <div style={{maxWidth:440,width:"100%",margin:"0 auto",background:"#fff",borderRadius:"20px 20px 0 0",padding:16,border:"1px solid var(--line)",boxShadow:"0 -16px 40px rgba(0,0,0,.18)",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:800}}>إضافة منتج</h3>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:10,background:"#F1F5F9",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14}/></button>
        </div>
        <label style={{fontSize:11,fontWeight:700,color:"#475569",marginBottom:6,display:"block"}}>صورة المنتج *</label>
        <label style={{display:"flex",alignItems:"center",gap:10,background:"#F8FAFC",border:"1px dashed var(--line)",borderRadius:12,padding:10,cursor:"pointer",marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:10,background:preview?`${cssUrl(preview)} center/cover`:"#fff",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{!preview && <ImageIcon size={16} color={varMuted}/>}</div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:12.5,display:"flex",alignItems:"center",gap:6}}><Upload size={13}/> {busy?"جاري الضغط...":preview?"تم التحميل — اختر أخرى":"حمّل صورة (JPG/PNG)"}</div>
            <div className="mono" style={{fontSize:11,color:varMuted}}>تُضغط تلقائيا وتُحفظ في الجهاز</div>
          </div>
          <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />
        </label>
        <input style={s} placeholder="اسم المنتج *" value={name} onChange={e=>setName(e.target.value)} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
          <input style={s} placeholder="السعر (دج) *" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
          <input style={s} placeholder="الكمية" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        </div>
        <textarea style={{...s,marginTop:10,minHeight:64,resize:"vertical"}} placeholder="وصف مختصر" value={desc} onChange={e=>setDesc(e.target.value)} />
        {err && <div style={{marginTop:10,background:"var(--red-soft)",border:"1px solid #FECACA",color:"var(--red)",fontSize:12.5,fontWeight:700,borderRadius:10,padding:"9px 11px"}}>{err}</div>}
        <button onClick={submit} disabled={busy} style={{width:"100%",marginTop:12,background:busy?"#9AA3AF":"var(--red)",color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontWeight:800,fontSize:14,cursor:busy?"not-allowed":"pointer"}}>{busy?"...":"حفظ المنتج"}</button>
      </div>
    </div>
  );
}

function EditProductModal({product,onClose,onSave}){
  const [name,setName]=useState(product.name); const [price,setPrice]=useState(String(product.price)); const [desc,setDesc]=useState(product.desc||""); const [quantity,setQuantity]=useState(String(product.quantity ?? 0)); const [img,setImg]=useState(product.img); const [preview,setPreview]=useState(product.img); const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const handleFile=async(e)=>{
    const file=e.target.files?.[0]; if(!file) return;
    if(!file.type.startsWith("image/")) return setErr("اختر صورة فقط");
    if(file.size>12*1024*1024) return setErr("حجم الصورة كبير (max 12MB)");
    setBusy(true);
    try{ const d=await shrinkImage(file); setImg(d); setPreview(d); setErr("") }
    catch{ setErr("تعذر قراءة الصورة") }
    finally{ setBusy(false); e.target.value="" } // let the same file be re-picked after a failure
  };
  const submit=async()=>{
    if(busy) return;
    if(!name.trim()||!price) return setErr("أدخل الاسم والسعر");
    setBusy(true);
    try{ await onSave({...product,name,price:Number(price),quantity:Number(quantity)||0,desc,img}) }
    catch(e){ setErr(isQuotaError(e)?"مساحة التخزين ممتلئة — احذف منتجات قديمة":"تعذر حفظ التعديلات"); setBusy(false) }
  };
  const s=fieldStyle();
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(12,14,11,.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",zIndex:50}}>
      <div style={{maxWidth:440,width:"100%",margin:"0 auto",background:"#fff",borderRadius:"20px 20px 0 0",padding:16,border:"1px solid var(--line)",boxShadow:"0 -16px 40px rgba(0,0,0,.18)",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h3 style={{margin:0,fontSize:15,fontWeight:800}}>تعديل المنتج</h3>
          <button onClick={onClose} style={{width:30,height:30,borderRadius:10,background:"#F1F5F9",border:"1px solid var(--line)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14}/></button>
        </div>
        <label style={{display:"flex",alignItems:"center",gap:10,background:"#F8FAFC",border:"1px dashed var(--line)",borderRadius:12,padding:10,cursor:"pointer",marginBottom:10}}>
          <div style={{width:48,height:48,borderRadius:10,background:`${cssUrl(preview)} center/cover`,border:"1px solid var(--line)",flexShrink:0}}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:12.5,display:"flex",alignItems:"center",gap:6}}><Upload size={13}/> {busy?"جاري الضغط...":"تغيير الصورة"}</div>
            <div className="mono" style={{fontSize:11,color:varMuted}}>اضغط للتحميل</div>
          </div>
          <input type="file" accept="image/*" onChange={handleFile} style={{display:"none"}} />
        </label>
        <input style={s} placeholder="اسم المنتج" value={name} onChange={e=>setName(e.target.value)} />
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>
          <input style={s} placeholder="السعر" type="number" value={price} onChange={e=>setPrice(e.target.value)} />
          <input style={s} placeholder="الكمية" type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} />
        </div>
        <textarea style={{...s,marginTop:10,minHeight:64,resize:"vertical"}} placeholder="وصف" value={desc} onChange={e=>setDesc(e.target.value)} />
        {err && <div style={{marginTop:10,background:"var(--red-soft)",border:"1px solid #FECACA",color:"var(--red)",fontSize:12.5,fontWeight:700,borderRadius:10,padding:"9px 11px"}}>{err}</div>}
        <button onClick={submit} disabled={busy} style={{width:"100%",marginTop:12,background:busy?"#9AA3AF":"var(--ink)",color:"#fff",border:"none",borderRadius:12,padding:"13px 0",fontWeight:800,fontSize:14,cursor:busy?"not-allowed":"pointer"}}>{busy?"...":"حفظ التعديلات"}</button>
      </div>
    </div>
  );
}

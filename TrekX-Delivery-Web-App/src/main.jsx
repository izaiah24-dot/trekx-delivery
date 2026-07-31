import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import logo from "./public_logo.jpg";
import {createClient} from "@supabase/supabase-js";
import {Bike,MapPin,Package,User,Phone,LogIn,Menu,X,CheckCircle} from "lucide-react";
import "./style.css";

const supabaseUrl=import.meta.env.VITE_SUPABASE_URL;
const supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase=supabaseUrl&&supabaseKey?createClient(supabaseUrl,supabaseKey):null;

function App(){
 const [menu,setMenu]=useState(false),[tab,setTab]=useState("delivery"),[msg,setMsg]=useState("");
 const [form,setForm]=useState({pickup:"",destination:"",sender:"",phone:"",recipient:"",item:""});
 const [auth,setAuth]=useState({email:"",password:""});
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 async function book(e){
  e.preventDefault(); setMsg("");
  if(!supabase){setMsg("Demo mode: add your Supabase keys in .env to enable real bookings.");return}
  const {data:{user}}=await supabase.auth.getUser();
  if(!user){setMsg("Please create an account or sign in first.");return}
  const {error}=await supabase.from("deliveries").insert({...form,user_id:user.id,status:"Pending"});
  setMsg(error?error.message:"Delivery request submitted successfully!");
 }
 async function authSubmit(e){
  e.preventDefault(); if(!supabase){setMsg("Add Supabase keys first.");return}
  const action=tab==="signup"?supabase.auth.signUp(auth):supabase.auth.signInWithPassword(auth);
  const {error}=await action; setMsg(error?error.message:tab==="signup"?"Check your email to confirm your account.":"Signed in successfully!");
 }
return <><header><a className="brand" href="#"><img src=" {logo}/>"/><span>TrekX <b>Delivery</b></span></a><nav className={menu?"open":""}><a href="#home">Home</a><a href="#how">How it works</a><a href="#riders">Become a rider</a><button onClick={()=>setTab("signin")}>Sign in</button></nav><button className="hamb" onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></header>
 <main id="home"><section className="hero"><div><p className="eyebrow">FAST • RELIABLE • LOCAL</p><h1>Deliver anything.<br/><em>Anywhere in Calabar.</em></h1><p className="lead">Book a trusted rider, track your package, and get it delivered with TrekX.</p><div className="heroBtns"><a href="#book" className="primary">Book a delivery</a><a href="#how" className="ghost">How it works</a></div></div><div className="visual"><Bike size={190}/><div className="bubble">⚡ Fast delivery</div><div className="bubble two">📍 Live tracking</div></div></section>
 <section id="book" className="booking"><div className="card"><div className="tabs"><button className={tab==="delivery"?"active":""} onClick={()=>setTab("delivery")}>Book delivery</button><button className={tab==="signup"?"active":""} onClick={()=>setTab("signup")}>Create account</button></div>
 {tab==="delivery"?<form onSubmit={book}><h2>Where should we deliver?</h2><label><MapPin/> Pickup location<input required name="pickup" value={form.pickup} onChange={change} placeholder="Enter pickup address"/></label><label><MapPin/> Destination<input required name="destination" value={form.destination} onChange={change} placeholder="Enter delivery address"/></label><div className="grid"><label><User/> Sender<input required name="sender" value={form.sender} onChange={change} placeholder="Your name"/></label><label><Phone/> Phone<input required name="phone" value={form.phone} onChange={change} placeholder="Phone number"/></label></div><div className="grid"><label><User/> Recipient<input required name="recipient" value={form.recipient} onChange={change} placeholder="Recipient name"/></label><label><Package/> Package<input required name="item" value={form.item} onChange={change} placeholder="What are we delivering?"/></label></div><button className="primary wide">Request delivery →</button></form>:<form onSubmit={authSubmit}><h2>{tab==="signup"?"Create your TrekX account":"Welcome back"}</h2><label>Email<input type="email" required onChange={e=>setAuth({...auth,email:e.target.value})}/></label><label>Password<input type="password" required minLength="6" onChange={e=>setAuth({...auth,password:e.target.value})}/></label><button className="primary wide">{tab==="signup"?"Create account":"Sign in"}</button><p className="switch" onClick={()=>setTab(tab==="signup"?"signin":"signup")}>{tab==="signup"?"Already have an account? Sign in":"New here? Create an account"}</p></form>}
 {msg&&<p className="message"><CheckCircle size={18}/>{msg}</p>}</div></section>
 <section id="how" className="steps"><p className="eyebrow">SIMPLE AND EASY</p><h2>Delivery in three steps</h2><div className="stepgrid"><article><span>01</span><MapPin/><h3>Enter locations</h3><p>Tell us where to pick up and where to deliver.</p></article><article><span>02</span><Bike/><h3>Get matched</h3><p>A nearby independent rider accepts your request.</p></article><article><span>03</span><Package/><h3>Track & receive</h3><p>Follow your delivery and receive it safely.</p></article></div></section>
 <section id="riders" className="rider"><div><p className="eyebrow">EARN WITH TREKX</p><h2>Turn your bike into income.</h2><p>Join TrekX as an independent delivery rider and earn on your schedule.</p><button className="primary">Become a rider</button></div><Bike size={160}/></section></main>
 <footer><div className="brand"><Bike/> TrekX Delivery</div><p>Book. Track. Deliver.</p><small>© 2026 TrekX Delivery. All rights reserved.</small></footer></> }
createRoot(document.getElementById("root")).render(<App/>);

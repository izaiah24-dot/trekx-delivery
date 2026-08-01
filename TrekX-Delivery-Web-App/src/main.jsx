import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

import {
  MapPin,
  Package,
  User,
  Phone,
  LogIn,
  Menu,
  LogOut,
  Navigation,
  X,
  CheckCircle,
  Home,
  Search,
  ClipboardList,
  UserCircle,
  ArrowRight
} from "lucide-react";

import Logo from "./Logo";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;


function App() {

  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("signin");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    sender: "",
    phone: "",
    recipient: "",
    item: ""
  });

  const [auth, setAuth] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const changeForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const changePage = (newPage) => {
    setPage(newPage);
    setMenu(false);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  async function loadDeliveries() {
    if (!supabase || !user) return;

    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error) {
      setDeliveries(data || []);
    }
  }

  useEffect(() => {
    if (page === "deliveries") {
      loadDeliveries();
    }
  }, [page, user]);

  async function bookDelivery(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("TrekX is still connecting to its database.");
      return;
    }

    if (!user) {
      setMessage("Please sign in before requesting a delivery.");
      setAuthMode("signin");
      setPage("account");
      return;
    }

    const { error } = await supabase
      .from("deliveries")
      .insert({
        ...form,
        user_id: user.id,
        status: "Pending"
      });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Delivery request submitted successfully!");

    setForm({
      pickup: "",
      destination: "",
      sender: "",
      phone: "",
      recipient: "",
      item: ""
    });
  }

  async function submitAuth(event) {
    event.preventDefault();
    setMessage("");

    if (!supabase) {
      setMessage("The TrekX database connection is not available.");
      return;
    }

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: auth.email,
          password: auth.password
        });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage(
          "Account created. Check your email if confirmation is enabled."
        );
      } else {
        const { error } =
          await supabase.auth.signInWithPassword({
            email: auth.email,
            password: auth.password
          });

        if (error) {
          setMessage(error.message);
          return;
        }

        setMessage("Signed in successfully!");
        changePage("book");
      }
    } catch {
      setMessage(
        "Connection failed. Please check your internet and try again."
      );
    }
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut();
    }

    setUser(null);
    setDeliveries([]);
    changePage("home");
  }

  function HomePage() {
    return (
      <>
        <section className="hero">
          <div>
            <p className="eyebrow">
              FAST • RELIABLE • LOCAL
            </p>

            <h1>
              Deliver anything.
              <br />
              <em>Anywhere in Calabar.</em>
            </h1>

            <p className="lead">
              Request a trusted rider, monitor your delivery,
              and move packages with confidence using TrekX.
            </p>

            <div className="heroBtns">
              <button
                className="primary"
                onClick={() => changePage("book")}
              >
                Book a delivery
                <ArrowRight size={18} />
              </button>

              <button
                className="ghost"
                onClick={() => changePage("track")}
              >
                Track a delivery
              </button>
            </div>
          </div>

          <div className="visual">
            <Logo size={190} />

            <div className="bubble">
              ⚡ Fast delivery
            </div>

            <div className="bubble two">
              📍 Live updates
            </div>
          </div>
        </section>

        <section className="steps">
          <p className="eyebrow">
            SIMPLE AND EASY
          </p>

          <h2>
            Delivery in three steps
          </h2>

          <div className="stepgrid">
            <article>
              <span>01</span>
              <MapPin />

              <h3>
                Enter locations
              </h3>

              <p>
                Tell TrekX where your package
                should be picked up and delivered.
              </p>
            </article>

            <article>
              <span>02</span>
              <Logo size={32} />

              <h3>
                Get matched
              </h3>

              <p>
                An available independent rider
                can accept your delivery request.
              </p>
            </article>

            <article>
              <span>03</span>
              <Package />

              <h3>
                Track and receive
              </h3>

              <p>
                Follow your delivery status
                until the package arrives.
              </p>
            </article>
          </div>
        </section>

        <section className="rider">
          <div>
            <p className="eyebrow">
              EARN WITH TREKX
            </p>

            <h2>
              Turn your <Logo size={32} /> into income.
            </h2>

            <p>
              Join TrekX as an independent delivery
              rider and earn on your schedule.
            </p>

            <button
              className="lightButton"
              onClick={() => changePage("account")}
            >
              Become a rider
            </button>
          </div>

          <Logo size={165} />
        </section>
      </>
    );
  }

  function BookPage() {
    return (
      <section className="pageSection">
        <div className="pageHeading">
          <p className="eyebrow">
            NEW DELIVERY
          </p>

          <h1>
            Book a delivery
          </h1>

          <p>
            Enter the pickup and destination details.
          </p>
        </div>

        <div className="card">
          <form onSubmit={bookDelivery}>
            <h2>
              Where should we deliver?
            </h2>

            <label>
              <MapPin />

              <input
                required
                name="pickup"
                value={form.pickup}
                onChange={changeForm}
                placeholder="Pickup location"
              />
            </label>

            <label>
              <Navigation />

              <input
                required
                name="destination"
                value={form.destination}
                onChange={changeForm}
                placeholder="Delivery destination"
              />
            </label>

            <div className="grid">
              <label>
                <User />

                <input
                  required
                  name="sender"
                  value={form.sender}
                  onChange={changeForm}
                  placeholder="Sender's name"
                />
              </label>

              <label>
                <Phone />

                <input
                  required
                  name="phone"
                  value={form.phone}
                  onChange={changeForm}
                  placeholder="Phone number"
                />
              </label>
            </div>

            <div className="grid">
              <label>
                <User />

                <input
                  required
                  name="recipient"
                  value={form.recipient}
                  onChange={changeForm}
                  placeholder="Recipient's name"
                />
              </label>

              <label>
                <Package />

                <input
                  required
                  name="item"
                  value={form.item}
                  onChange={changeForm}
                  placeholder="What are we delivering?"
                />
              </label>
            </div>

            <button className="primary wide">
              Request delivery
              <ArrowRight size={18} />
            </button>
          </form>

          {message && (
            <p className="message">
              <CheckCircle size={18} />
              {message}
            </p>
          )}
        </div>
      </section>
    );
  }

  function TrackPage() {
    return (
      <section className="pageSection">
        <div className="pageHeading">
          <p className="eyebrow">
            DELIVERY TRACKING
          </p>

          <h1>
            Track your package
          </h1>

          <p>
            Enter a TrekX delivery reference
            to view its current status.
          </p>
        </div>

        <div className="card trackCard">
          <Search size={42} />

          <h2>
            Find a delivery
          </h2>

          <label>
            <Package />

            <input
              placeholder="Enter delivery reference"
            />
          </label>

          <button
            className="primary wide"
            onClick={() =>
              setMessage(
                "Live tracking will be activated when rider tracking is connected."
              )
            }
          >
            Track delivery
          </button>

          {message && (
            <p className="message">
              <CheckCircle size={18} />
              {message}
            </p>
          )}
        </div>
      </section>
    );
  }

  function DeliveriesPage() {
    return (
      <section className="pageSection">
        <div className="pageHeading">
          <p className="eyebrow">
            YOUR ACTIVITY
          </p>

          <h1>
            My deliveries
          </h1>

          <p>
            View your current and previous requests.
          </p>
        </div>

        {!user ? (
          <div className="emptyState">
            <ClipboardList size={48} />

            <h2>
              Sign in to view deliveries
            </h2>

            <p>
              Your delivery history will appear here.
            </p>

            <button
              className="primary"
              onClick={() => {
                setAuthMode("signin");
                changePage("account");
              }}
            >
              Sign in
            </button>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="emptyState">
            <Package size={48} />

            <h2>
              No deliveries yet
            </h2>

            <p>
              Your delivery requests will appear here.
            </p>

            <button
              className="primary"
              onClick={() => changePage("book")}
            >
              Book a delivery
            </button>
          </div>
        ) : (
          <div className="deliveryList">
            {deliveries.map((delivery) => (
              <article
                className="deliveryItem"
                key={delivery.id}
              >
                <div>
                  <span className="status">
                    {delivery.status}
                  </span>

                  <h3>
                    {delivery.pickup}
                  </h3>

                  <p>
                    To: {delivery.destination}
                  </p>
                </div>

                <Package />
              </article>
            ))}
          </div>
        )}
      </section>
    );
  }

  function AccountPage() {
    if (user) {
      return (
        <section className="pageSection">
          <div className="pageHeading">
            <p className="eyebrow">
              YOUR ACCOUNT
            </p>

            <h1>
              Welcome to TrekX
            </h1>

            <p>
              {user.email}
            </p>
          </div>

          <div className="accountCard">
            <UserCircle size={70} />

            <h2>
              Account active
            </h2>

            <p>
              You can request deliveries and
              view your delivery history.
            </p>

            <button
              className="primary"
              onClick={() => changePage("book")}
            >
              Book a delivery
            </button>

            <button
              className="outlineButton"
              onClick={signOut}
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="pageSection">
        <div className="authCard">
          <div className="authTabs">
            <button
              className={
                authMode === "signin"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setAuthMode("signin");
                setMessage("");
              }}
            >
              Sign in
            </button>

            <button
              className={
                authMode === "signup"
                  ? "active"
                  : ""
              }
              onClick={() => {
                setAuthMode("signup");
                setMessage("");
              }}
            >
              Create account
            </button>
          </div>

          <form onSubmit={submitAuth}>
            <h2>
              {authMode === "signup"
                ? "Create your TrekX account"
                : "Welcome back"}
            </h2>

            <label>
              <User />

              <input
                type="email"
                required
                value={auth.email}
                onChange={(event) =>
                  setAuth({
                    ...auth,
                    email: event.target.value
                  })
                }
                placeholder="Email address"
              />
            </label>

            <label>
              <LogIn />

              <input
                type="password"
                required
                minLength="6"
                value={auth.password}
                onChange={(event) =>
                  setAuth({
                    ...auth,
                    password: event.target.value
                  })
                }
                placeholder="Password"
              />
            </label>

            <button className="primary wide">
              {authMode === "signup"
                ? "Create account"
                : "Sign in"}
            </button>
          </form>

          {message && (
            <p className="message">
              <CheckCircle size={18} />
              {message}
            </p>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      <header>
        <button
          className="brand"
          onClick={() => changePage("home")}
        >
          <Logo size={32} />

          <span>
            TrekX <b>Delivery</b>
          </span>
        </button>

        <nav className={menu ? "open" : ""}>
          <button onClick={() => changePage("home")}>
            Home
          </button>

          <button onClick={() => changePage("book")}>
            Book
          </button>

          <button onClick={() => changePage("track")}>
            Track
          </button>

          <button
            onClick={() => changePage("deliveries")}
          >
            My Deliveries
          </button>

          <button
            className="navAccount"
            onClick={() => changePage("account")}
          >
            {user ? "Account" : "Sign in"}
          </button>
        </nav>

        <button
          className="hamb"
          onClick={() => setMenu(!menu)}
          aria-label="Open menu"
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        {page === "home" && <HomePage />}

        {page === "book" && <BookPage />}

        {page === "track" && <TrackPage />}

        {page === "deliveries" && (
          <DeliveriesPage />
        )}

        {page === "account" && <AccountPage />}
      </main>

      <footer>
        <div className="footerBrand">
          <Logo size={32} />

          <span>
            TrekX Delivery
          </span>
        </div>

        <p>
          Book. Track. Deliver.
        </p>

        <small>
          © 2026 TrekX Delivery.
          All rights reserved.
        </small>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);

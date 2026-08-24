import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

import {
  GoogleMap,
  LoadScript,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

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
  ClipboardList,
  UserCircle,
  ArrowRight,
} from "lucide-react";

import Logo from "./Logo";
import "./style.css";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

const GOOGLE_MAPS_LIBRARIES = ["places"];

function HomePage({ changePage }) {
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
            Request a trusted rider, monitor your delivery and move
            packages with confidence using TrekX.
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
              Track Delivery
            </button>
          </div>
        </div>

        <div className="visual">
          <Logo size={190} />

          <div className="bubble">
            ⚡ Fast Delivery
          </div>

          <div className="bubble two">
            📍 Live Tracking
          </div>
        </div>
      </section>

      <section className="steps">
        <p className="eyebrow">
          SIMPLE & EASY
        </p>

        <h2>
          Delivery in three steps
        </h2>

        <div className="stepgrid">

          <article>
            <span>01</span>
            <MapPin />

            <h3>Enter Locations</h3>

            <p>
              Choose pickup and destination.
            </p>
          </article>

          <article>
            <span>02</span>
            <Logo size={34} />

            <h3>Find Rider</h3>

            <p>
              TrekX matches you with a nearby rider.
            </p>
          </article>

          <article>
            <span>03</span>
            <Package />

            <h3>Track Package</h3>

            <p>
              Follow your delivery until it arrives.
            </p>
          </article>

        </div>
      </section>
    </>
  );
}

function BookPage({
  marker,
  setMarker,
  directions,
  form,
  changeForm,
  bookDelivery,
  setPickupAutocomplete,
  pickupAutocomplete,
  setDestinationAutocomplete,
  destinationAutocomplete,
  setForm,
  calculateRoute,
  distance,
  duration,
  price,
  message,
}) {
  return (
    <section className="pageSection">
      <div className="pageHeading">
        <p className="eyebrow">NEW DELIVERY</p>

        <h1>Book a Delivery</h1>

        <p>Enter your pickup and destination.</p>
      </div>

      <div className="card">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "400px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
          center={marker}
          zoom={13}
          onClick={(e) => {
            setMarker({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            });
          }}
        >
          <Marker position={marker} />

          {directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>

        <form onSubmit={bookDelivery}>
          <h2>Where should we deliver?</h2>

          <label>
            <MapPin />

            <Autocomplete
              onLoad={setPickupAutocomplete}
              onPlaceChanged={() => {
                const place = pickupAutocomplete?.getPlace();

                if (place?.formatted_address) {
                  setForm((prev) => ({
                    ...prev,
                    pickup: place.formatted_address,
                  }));
                }
              }}
            >
              <input
                required
                value={form.pickup}
                placeholder="Pickup location"
                readOnly
              />
            </Autocomplete>
          </label>

          <label>
            <Navigation />

            <Autocomplete
              onLoad={setDestinationAutocomplete}
              onPlaceChanged={() => {
                const place =
                  destinationAutocomplete?.getPlace();

                if (place?.formatted_address) {
                  setForm((prev) => ({
                    ...prev,
                    destination: place.formatted_address,
                  }));

                  setTimeout(calculateRoute, 300);
                }
              }}
            >
              <input
                required
                value={form.destination}
                placeholder="Destination"
                readOnly
              />
            </Autocomplete>
          </label>

          {distance && (
            <div className="priceCard">
              <p>
                <strong>Distance:</strong> {distance}
              </p>

              <p>
                <strong>Estimated Time:</strong> {duration}
              </p>

              <p>
                <strong>Estimated Price:</strong> ₦{price}
              </p>
            </div>
          )}

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
                placeholder="Package description"
              />
            </label>
          </div>

          <button className="primary wide">
            Request Delivery
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

function TrackPage({ marker, directions }) {
  return (
    <section className="pageSection">
      <div className="pageHeading">
        <p className="eyebrow">LIVE TRACKING</p>

        <h1>Track Your Rider</h1>

        <p>Follow your rider in real time.</p>
      </div>

      <div className="card">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "450px",
            borderRadius: "12px",
          }}
          center={marker}
          zoom={13}
        >
          <Marker position={marker} />

          {directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>
      </div>
    </section>
  );
}

function DeliveriesPage({ user, deliveries, changePage, setAuthMode }) {
  return (
    <section className="pageSection">
      <div className="pageHeading">
        <p className="eyebrow">YOUR DELIVERIES</p>

        <h1>My Deliveries</h1>

        <p>All your delivery requests.</p>
      </div>

      {!user ? (
        <div className="emptyState">
          <ClipboardList size={60} />

          <h2>Please sign in</h2>

          <p>
            Login to view your delivery history.
          </p>

          <button
            className="primary"
            onClick={() => {
              setAuthMode("signin");
              changePage("account");
            }}
          >
            Sign In
          </button>
        </div>
      ) : deliveries.length === 0 ? (
        <div className="emptyState">
          <Package size={60} />

          <h2>No deliveries yet</h2>

          <button
            className="primary"
            onClick={() => changePage("book")}
          >
            Book Delivery
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

                <h3>{delivery.pickup}</h3>

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

function AccountPage({
  user,
  authMode,
  setAuthMode,
  auth,
  setAuth,
  submitAuth,
  signOut,
  changePage,
  message,
}) {
  if (user) {
    return (
      <section className="pageSection">
        <div className="pageHeading">
          <p className="eyebrow">YOUR ACCOUNT</p>

          <h1>Welcome to TrekX</h1>

          <p>{user.email}</p>
        </div>

        <div className="accountCard">
          <UserCircle size={70} />

          <h2>Account Active</h2>

          <p>
            You can now book deliveries and view your history.
          </p>

          <button
            className="primary"
            onClick={() => changePage("book")}
          >
            Book Delivery
          </button>

          <button
            className="outlineButton"
            onClick={signOut}
          >
            <LogOut size={18} />
            Sign Out
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
            className={authMode === "signin" ? "active" : ""}
            onClick={() => setAuthMode("signin")}
          >
            Sign In
          </button>

          <button
            className={authMode === "signup" ? "active" : ""}
            onClick={() => setAuthMode("signup")}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={submitAuth}>
          <h2>
            {authMode === "signup"
              ? "Create your account"
              : "Welcome Back"}
          </h2>

          <label>
            <User />

            <input
              type="email"
              required
              value={auth.email}
              placeholder="Email"
              onChange={(e) =>
                setAuth({
                  ...auth,
                  email: e.target.value,
                })
              }
            />
          </label>

          <label>
            <LogIn />

            <input
              type="password"
              required
              minLength={6}
              value={auth.password}
              placeholder="Password"
              onChange={(e) =>
                setAuth({
                  ...auth,
                  password: e.target.value,
                })
              }
            />
          </label>

          <button className="primary wide">
            {authMode === "signup"
              ? "Create Account"
              : "Sign In"}
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

function App() {
  const [menu, setMenu] = useState(false);
  const [page, setPage] = useState("home");
  const [authMode, setAuthMode] = useState("signin");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState([]);

  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [destinationAutocomplete, setDestinationAutocomplete] = useState(null);

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(0);

  const [marker, setMarker] = useState({
    lat: 4.9589,
    lng: 8.3269,
  });

  const [form, setForm] = useState({
    pickup: "",
    destination: "",
    sender: "",
    phone: "",
    recipient: "",
    item: "",
  });

  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });

  // ---- Auth listener ----
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ---- Load deliveries whenever the logged-in user changes ----
  useEffect(() => {
    if (user) {
      loadDeliveries();
    } else {
      setDeliveries([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const changeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const changePage = (newPage) => {
    setPage(newPage);
    setMenu(false);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const calculateRoute = () => {
    if (!pickupAutocomplete || !destinationAutocomplete) return;
    if (!window.google) return;

    const origin = pickupAutocomplete.getPlace()?.formatted_address;
    const destination = destinationAutocomplete.getPlace()?.formatted_address;

    if (!origin || !destination) return;

    const service = new window.google.maps.DirectionsService();

    service.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);

          const leg = result.routes[0].legs[0];

          setDistance(leg.distance.text);
          setDuration(leg.duration.text);

          const km = leg.distance.value / 1000;

          setPrice(Math.round(1000 + km * 250));
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  // ---- Book a delivery (writes to Supabase) ----
  const bookDelivery = async (e) => {
    e.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    try {
      const { error } = await supabase.from("deliveries").insert([
        {
          user_id: user?.id || null,
          pickup: form.pickup,
          destination: form.destination,
          sender: form.sender,
          phone: form.phone,
          recipient: form.recipient,
          item: form.item,
          price,
          status: "pending",
        },
      ]);

      if (error) throw error;

      setMessage("Delivery requested successfully!");

      setForm({
        pickup: "",
        destination: "",
        sender: "",
        phone: "",
        recipient: "",
        item: "",
      });

      setDistance("");
      setDuration("");
      setPrice(0);
      setDirections(null);

      if (user) {
        loadDeliveries();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Something went wrong booking your delivery.");
    }
  };

  // ---- Load the current user's deliveries ----
  const loadDeliveries = async () => {
    if (!supabase || !user) return;

    try {
      const { data, error } = await supabase
        .from("deliveries")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setDeliveries(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---- Sign in / Sign up ----
  const submitAuth = async (e) => {
    e.preventDefault();

    if (!supabase) {
      setMessage("Supabase is not configured.");
      return;
    }

    try {
      if (authMode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: auth.email,
          password: auth.password,
        });

        if (error) throw error;

        setMessage("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: auth.email,
          password: auth.password,
        });

        if (error) throw error;

        setMessage("Signed in successfully!");
      }

      setAuth({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Authentication failed.");
    }
  };

  // ---- Sign out ----
  const signOut = async () => {
    if (!supabase) return;

    await supabase.auth.signOut();
    setUser(null);
    setDeliveries([]);
    changePage("home");
  };

  return (
    <LoadScript
      googleMapsApiKey={googleMapsApiKey}
      libraries={GOOGLE_MAPS_LIBRARIES}
    >
      <header>
        <button
          className="brand"
          onClick={() => changePage("home")}
        >
          <Logo size={34} />
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
            onClick={() => changePage("account")}
          >
            {user ? "Account" : "Sign In"}
          </button>
        </nav>

        <button
          className="hamb"
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        {page === "home" && (
          <HomePage changePage={changePage} />
        )}

        {page === "book" && (
          <BookPage
            marker={marker}
            setMarker={setMarker}
            directions={directions}
            form={form}
            setForm={setForm}
            changeForm={changeForm}
            bookDelivery={bookDelivery}
            pickupAutocomplete={pickupAutocomplete}
            setPickupAutocomplete={setPickupAutocomplete}
            destinationAutocomplete={destinationAutocomplete}
            setDestinationAutocomplete={setDestinationAutocomplete}
            calculateRoute={calculateRoute}
            distance={distance}
            duration={duration}
            price={price}
            message={message}
          />
        )}

        {page === "track" && (
          <TrackPage marker={marker} directions={directions} />
        )}

        {page === "deliveries" && (
          <DeliveriesPage
            user={user}
            deliveries={deliveries}
            changePage={changePage}
            setAuthMode={setAuthMode}
          />
        )}

        {page === "account" && (
          <AccountPage
            user={user}
            authMode={authMode}
            setAuthMode={setAuthMode}
            auth={auth}
            setAuth={setAuth}
            submitAuth={submitAuth}
            signOut={signOut}
            changePage={changePage}
            message={message}
          />
        )}
      </main>

      <footer>
        <Logo size={32} />

        <p>Book • Track • Deliver</p>

        <small>
          © 2026 TrekX Delivery. All rights reserved.
        </small>
      </footer>
    </LoadScript>
  );
}

createRoot(document.getElementById("root")).render(
  <App />
);
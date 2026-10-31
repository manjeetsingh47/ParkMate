import { useState } from "react";
import { PageHero } from "../Hero.jsx";
import { USER } from "../data.js";

export default function Profile() {
  const [name, setName] = useState(USER.name);
  const [phone, setPhone] = useState(USER.phone);
  const [email, setEmail] = useState(USER.email);
  const [saved, setSaved] = useState(false);

  const [vehicles, setVehicles] = useState(USER.vehicles);
  const [vnum, setVnum] = useState("");
  const [vtype, setVtype] = useState("Car");

  const [pw, setPw] = useState({ cur: "", next: "" });
  const [pwMsg, setPwMsg] = useState("");

  function save(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }
  function addVehicle(e) {
    e.preventDefault();
    if (!vnum.trim()) return;
    setVehicles((v) => [...v, { id: Date.now(), number: vnum.trim().toUpperCase(), type: vtype }]);
    setVnum("");
  }
  function changePw(e) {
    e.preventDefault();
    if (pw.next.length < 6) {
      setPwMsg("New password must be at least 6 characters.");
      return;
    }
    setPwMsg("Password updated.");
    setPw({ cur: "", next: "" });
  }

  return (
    <>
      <PageHero lead="Account" accent="Settings" sub="Your details, vehicles and password." />

      <section className="panel me">
        <span className="avatar big-av">{name.trim()[0] || "?"}</span>
        <div>
          <div className="big">{name}</div>
          <div className="muted-s">{email} · {phone}</div>
        </div>
        <span className="badge b-active">{vehicles.length} vehicle{vehicles.length === 1 ? "" : "s"}</span>
      </section>

      <div className="two">
        <form className="panel" onSubmit={save}>
          <h2>Personal details</h2>
          <div className="f">
            <label htmlFor="pn">Full name</label>
            <input id="pn" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="f">
            <label htmlFor="pp">Mobile number</label>
            <input id="pp" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="f">
            <label htmlFor="pe">Email</label>
            <input id="pe" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="actions">
            <button className="btn btn-green" type="submit">
              Save changes
            </button>
            {saved && <span className="ok-text">Saved</span>}
          </div>
        </form>

        <section className="panel">
          <h2>My vehicles</h2>
          <ul className="list">
            {vehicles.map((v) => (
              <li key={v.id}>
                <div>
                  <div className="strong">{v.number}</div>
                  <div className="muted-s">{v.type}</div>
                </div>
                <button className="btn btn-ghost sm" onClick={() => setVehicles((all) => all.filter((x) => x.id !== v.id))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <form className="add-v" onSubmit={addVehicle}>
            <div className="f grow">
              <label htmlFor="vn">Vehicle number</label>
              <input id="vn" type="text" placeholder="MH 12 AB 1234" value={vnum} onChange={(e) => setVnum(e.target.value)} />
            </div>
            <div className="f">
              <label htmlFor="vt">Type</label>
              <select id="vt" value={vtype} onChange={(e) => setVtype(e.target.value)}>
                <option>Car</option>
                <option>Bike</option>
                <option>SUV</option>
              </select>
            </div>
            <button className="btn btn-green" type="submit">
              Add
            </button>
          </form>
        </section>
      </div>

      <form className="panel pw-form" onSubmit={changePw}>
        <h2>Change password</h2>
        <div className="pw-grid">
          <div className="f">
            <label htmlFor="cp">Current password</label>
            <input id="cp" type="password" autoComplete="current-password" value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} />
          </div>
          <div className="f">
            <label htmlFor="np">New password</label>
            <input id="np" type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
          </div>
        </div>
        <div className="actions">
          <button className="btn btn-green" type="submit">
            Update password
          </button>
          {pwMsg && <span className="muted-s">{pwMsg}</span>}
        </div>
      </form>
    </>
  );
}

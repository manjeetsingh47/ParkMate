import { useState } from "react";
import Icon from "../Icon.jsx";
import { PageHero } from "../Hero.jsx";
import { TRANSACTIONS, METHODS, inr } from "../data.js";

export default function Payments() {
  const [balance, setBalance] = useState(395);
  const [txns, setTxns] = useState(TRANSACTIONS);

  function topUp(amount) {
    setBalance((b) => b + amount);
    setTxns((t) => [
      { id: "T-" + Date.now(), title: "Wallet top-up (UPI)", date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), amount },
      ...t,
    ]);
  }

  return (
    <>
      <PageHero lead="My" accent="Wallet" sub="Your balance, saved payment methods and transactions." />

      <div className="two">
        <section className="wallet">
          <span className="wallet-label"><Icon name="wallet" size={18} /> Wallet balance</span>
          <div className="bal">{inr(balance)}</div>
          <div className="actions">
            {[100, 500, 1000].map((a) => (
              <button key={a} className="btn btn-green" onClick={() => topUp(a)}>
                <Icon name="plus" size={15} stroke={2.6} /> {inr(a)}
              </button>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Saved methods</h2>
          <ul className="list">
            {METHODS.map((m) => (
              <li key={m.id}>
                <div>
                  <div className="strong">{m.label}</div>
                  <div className="muted-s">{m.detail}</div>
                </div>
                {m.main && <span className="badge b-active">Default</span>}
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost add">Add payment method</button>
        </section>
      </div>

      <section className="panel">
        <h2>Transactions</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Details</th>
                <th>Date</th>
                <th className="r">Amount</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className="tx">
                      <i className={"tx-ico " + (t.amount > 0 ? "in" : "out")}>
                        <Icon name={t.amount > 0 ? "down" : "up"} size={16} stroke={2.4} />
                      </i>
                      <span>
                        <span className="strong">{t.title}</span>
                        <small className="muted-s">{t.id}</small>
                      </span>
                    </span>
                  </td>
                  <td className="muted-s-cell">{t.date}</td>
                  <td className={"r strong " + (t.amount > 0 ? "plus" : "")}>
                    {t.amount > 0 ? "+" : "-"}
                    {inr(Math.abs(t.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

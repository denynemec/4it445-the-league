import React from 'react';

export const MainSection = ({ children }) => (
  <div className="pa3 bt b--black-10">
    <section className="mw7 center justify-center flex flex-column">
      {children}
    </section>
  </div>
);

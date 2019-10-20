import React from "react";

export const Pdf = ({style, onAction, title}) => {
  return (
    <span style={{...style}} title={title} onClick={onAction}>
      <svg
        height = {style.height}
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        enableBackground="new 0 0 496 496"
        version="1.1"
        viewBox="0 0 496 496"
        xmlSpace="preserve"
      >
        <path d="M472 32h-72V0H100.688L0 100.688V496h400V192h72c13.232 0 24-10.768 24-24V56c0-13.232-10.768-24-24-24zM96 27.312V96H27.312L96 27.312zM384 480H16V112h96V16h272v16H184c-13.232 0-24 10.768-24 24v112c0 13.232 10.768 24 24 24h200v288zm96-312c0 4.408-3.592 8-8 8H184c-4.408 0-8-3.592-8-8V56c0-4.408 3.592-8 8-8h288c4.408 0 8 3.592 8 8v112z" />
        <path fill="red" d="M244 64h-52v96h16v-40h36c15.44 0 28-12.56 28-28s-12.56-28-28-28zm0 40h-36V80h36c6.616 0 12 5.384 12 12s-5.384 12-12 12z" />
        <path d="M32 128H48V144H32z" />
        <path d="M64 128H80V144H64z" />
        <path d="M32 160H48V176H32z" />
        <path fill="red" d="M320 64h-32v96h32c26.472 0 48-21.528 48-48s-21.528-48-48-48zm0 80h-16V80h16c17.648 0 32 14.352 32 32s-14.352 32-32 32z" />
        <path fill="red" d="M384 160L400 160 400 120 448 120 448 104 400 104 400 80 464 80 464 64 384 64z" />
        <path fill="red" d="M160 247.264v7.272c0 7.776 2.28 15.312 6.592 21.776L190.384 312l-48 72h-55.12C65.616 384 48 401.616 48 423.264v1.472C48 446.384 65.616 464 87.264 464a39.177 39.177 0 0032.672-17.488L150.952 400h98.104l31.008 46.512A39.177 39.177 0 00312.736 464C334.384 464 352 446.384 352 424.736v-1.472C352 401.616 334.384 384 312.736 384h-55.12l-48-72 23.792-35.688A39.148 39.148 0 00240 254.536v-7.272C240 225.616 222.384 208 200.736 208h-1.472C177.616 208 160 225.616 160 247.264zM106.624 437.64A23.21 23.21 0 0187.264 448C74.44 448 64 437.56 64 424.736v-1.472C64 410.44 74.44 400 87.264 400h44.456l-25.096 37.64zM312.736 400C325.56 400 336 410.44 336 423.264v1.472C336 437.56 325.56 448 312.736 448a23.22 23.22 0 01-19.36-10.36L268.28 400h44.456zm-74.352-16h-76.776L200 326.424 238.384 384zM176 247.264C176 234.44 186.44 224 199.264 224h1.472C213.56 224 224 234.44 224 247.264v7.272c0 4.608-1.352 9.072-3.904 12.904L200 297.576l-20.096-30.144A23.168 23.168 0 01176 254.536v-7.272z" />
        <path d="M192 416H208V432H192z" />
        <path d="M224 416H240V432H224z" />
        <path d="M160 416H176V432H160z" />
      </svg>
      <label style={{cursor: "pointer", fontStyle: "italic"}}>{title}</label>
    </span>
  );
}

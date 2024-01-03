import * as React from "react";
export default function Unauthorized() {
    return (
        <div style={{
            height: '30rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <p className="h1">You are not authorized</p>
        </div>
    )
}
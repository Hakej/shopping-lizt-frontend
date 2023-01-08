import * as React from 'react';
import './FlippingText.css';
import { useState } from "react";

export default function FlippingText({ text }) {
    const [flipText] = useState(text.split(''))

    var howManySpacesThereWas = 0

    return (
        <div className="waviy">
            {
                flipText.map((char, i) => {
                    if (char === " ") {
                        howManySpacesThereWas++
                        return " "
                    }
                    else {
                        const index = i - howManySpacesThereWas
                        return (<span key={index} style={{ '--i': index }}>{char}</span>)
                    }
                })
            }
        </div>
    );
}
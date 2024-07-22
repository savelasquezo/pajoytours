import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const RecaptchaV3 = ({ onVerify }) => {
    const [token, setToken] = useState(null);

    const handleChange = (value) => {
        setToken(value);
        if (onVerify) {
            onVerify(value);
        }
    };

    return (
        <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            onChange={handleChange}
        />
    );
};

export default RecaptchaV3;
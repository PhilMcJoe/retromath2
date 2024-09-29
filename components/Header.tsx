"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Header() {
    return (
        <div className="retro-header">
            <SignedOut>
                <SignInButton>
                    <button className="retro-button">Sign In</button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
            <style jsx>{`
                .retro-header {
                    display: flex;
                    justify-content: flex-end;
                    padding: 10px;
                }
                .retro-button {
                    background-color: #000;
                    color: #0f0;
                    border: 2px solid #0f0;
                    padding: 5px 10px;
                    font-family: 'Press Start 2P', cursive;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .retro-button:hover {
                    background-color: #0f0;
                    color: #000;
                }
            `}</style>
        </div>
    );
}
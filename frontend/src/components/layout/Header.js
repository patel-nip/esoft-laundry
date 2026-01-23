import React from "react";

const now = new Date();
const formattedDateTime = now.toLocaleString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
});

function Header() {
    return (
        <header className="dashboard-header">
            <div>
                <div
                    style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "#9ca3af",
                    }}
                >
                    Date &amp; time
                </div>
                <div className="text-small">{formattedDateTime}</div>
            </div>
            {/* <div className="text-small">Laundry dashboard preview</div> */}
        </header>
    );
}

export default Header;

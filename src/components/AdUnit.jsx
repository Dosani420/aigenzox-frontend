/**
 * AdUnit Component
 * Completely invisible (renders nothing) if VITE_ADSENSE_CLIENT is not set.
 * Set it in your .env.production to enable ads automatically.
 */
function AdUnit({ format = "728x90", label = "Advertisement", className = "" }) {
    // Ads only show when the AdSense publisher ID is configured
    const publisherId = import.meta.env.VITE_ADSENSE_CLIENT;
    const adsEnabled = !!publisherId && publisherId !== "";

    // Render nothing at all if ads are not configured — no empty boxes
    if (!adsEnabled) return null;

    const adClass = format === "728x90" ? "ad-728x90" : "ad-336x280";

    return (
        <div className={`ad-unit ${adClass} ${className}`}>
            {/* Live AdSense insertion */}
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client={publisherId}
                data-ad-slot={import.meta.env.VITE_ADSENSE_SLOT || ""}
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
            <script>{`(adsbygoogle = window.adsbygoogle || []).push({});`}</script>
        </div>
    );
}

export default AdUnit;

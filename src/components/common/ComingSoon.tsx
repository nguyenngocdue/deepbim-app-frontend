import { LogoWord } from "../LogoWord";

export default function ComingSoon() {
    return (
        <div className="flex flex-col items-center justify-center">
            <LogoWord path="/images/logo_no_bg.png" size="lg-wrap" />
            <p className="text-md text-gray-500 mt-2">This feature is coming soon.</p>
        </div>
    );
}

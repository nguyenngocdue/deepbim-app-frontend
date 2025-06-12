import { SearchProvider } from "@/context/search-context";
import { TutorialCourseList } from "./components/TutorialCourseList";
import { TutorialFooter } from "./components/TutorialFooter";
import TutorialHeader from "./components/TutorialHeader";
import { TutorialSearchBanner } from "./components/TutorialCarouselBanner";



export default function TutorialHomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <SearchProvider>
                <TutorialHeader />
                <TutorialSearchBanner/>
                <TutorialCourseList />
                <TutorialFooter />
            </SearchProvider>
        </div>
    );
}

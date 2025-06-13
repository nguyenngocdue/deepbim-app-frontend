import { SearchProvider } from "@/context/search-context";
import { TutorialCourseList } from "./components/TutorialCourseList";
import { TutorialSearchBanner } from "./components/TutorialCarouselBanner";
import { TutorialHeader } from "./components/TutorialHeader";



export default function TutorialHomePage() {
    return (
        <div className="min-h-screen flex flex-col">
            <SearchProvider>
                <TutorialHeader />
                <TutorialSearchBanner/>
                <TutorialCourseList />
            </SearchProvider>
        </div>
    );
}

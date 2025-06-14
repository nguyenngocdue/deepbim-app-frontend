import { TutorialCourseList } from "./components/TutorialCourseList";
import { TutorialSearchBanner } from "./components/TutorialCarouselBanner";



export default function TutorialHomePage() {
    return (
        <div className="min-h-screen flex flex-col px-6">
            <TutorialSearchBanner />
            <TutorialCourseList />
        </div>
    );
}

import { useEffect } from 'react';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import getAssignmentsSteps from '../../../service/onboarding/assignmentsSteps';
import { useAuth } from '../../../service/authContext';
import "../../../service/onboarding/custom-shepherd-styles.scss";

const useAssignmentsOnboardingTour = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const tourFlag = localStorage.getItem('onboardingTourShown');

    if (!tourFlag) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'shadow-md bg-purple-dark shepherd-theme-custom',
          scrollTo: false,
        },
      });

      const steps = getAssignmentsSteps(currentUser);
      steps.forEach((step) => tour.addStep(step));

      tour.start();

      tour.on('complete', () => {
        localStorage.setItem('onboardingTourShown', 'true');
      });

      tour.on('cancel', () => {
        localStorage.setItem('onboardingTourShown', 'true');
      });

      return () => {
        if (tour) {
          tour.complete();
        }
      };
    }
  }, [currentUser]);
};

localStorage.removeItem('onboardingTourShown'); // comment this line if testing is needed 

export default useAssignmentsOnboardingTour;





    // // Highlight the Assignments tab when the tour starts
    // tour.on('start', () => {
    //   const element = document.getElementById('onboarding_assignments_menu');
    //   if (element) {
    //     element.classList.add('highlighted');
    //   }
    // });

    // // Remove the highlight from the Assignments tab when the tour ends or is cancelled
    // tour.on('complete', () => {
    //   const element = document.getElementById('onboarding_assignments_menu');
    //   if (element) {
    //     element.classList.remove('highlighted');
    //   }
    // });

    // tour.on('cancel', () => {
    //   const element = document.getElementById('onboarding_assignments_menu');
    //   if (element) {
    //     element.classList.remove('highlighted');
    //   }
    // });

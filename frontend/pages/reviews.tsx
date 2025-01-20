import { useRouter } from 'next/navigation';
import {useContext, useEffect, useState} from "react";
import Layout from "@/contents/layout/Layout";
import React, { useRef} from 'react';
import {ProfileContext} from "@/contexts/ProfileContext";
import ReviewsTable from '@/contents/components/reviewsTable/ReviewsTable';

// Hook
function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // only execute all the code below in client side
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth as any,
                height: window.innerHeight as any,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
}

export default function Reviews() {
    const router = useRouter();
    const profile = useContext(ProfileContext);

    useEffect(() => {
        console.log('here')
        const profile: any = localStorage.getItem('profile');
        if (!profile) {
            console.log('no access token')
            router?.push('/login');
        } else {
            console.log('have access token')
        }
    }, []);


    return (
        <React.Fragment >
            <div style={{ backgroundImage: 'url("forest.jpg")' }}>
                <Layout />
                <div className='absolute left-[18%] top-[12%] w-[78%]' >
                    <ReviewsTable />
                </div>
            </div>
        </React.Fragment>
    );
}

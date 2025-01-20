import {NavLink, Tabs} from "@mantine/core";
import {useEffect, useState} from "react";
import {IconCategory, IconLogout2, IconSend2, IconTableHeart, IconLiveView} from "@tabler/icons-react";
import colors from "tailwindcss/colors";
import {usePathname, useRouter} from "next/navigation";
import {useContext} from "react";
import { ProfileContext } from "@/contexts/ProfileContext";

export default function NewSidebar() {
    const [active, setActive] = useState(0);
    const router = useRouter();
    const pathname = usePathname();
    const {logout} = useContext(ProfileContext);

    return (
        <div className="bg-white flex flex-col h-screen w-[15%] p-2 shadow-xl">
            {/* Partea de sus */}
            <div className="flex flex-col flex-grow">
                <div className="flex flex-row">
                    <NavLink
                        onClick={() => {
                            router?.push('/reviews');
                        }}
                        active={pathname.includes('reviews')}
                        label="Review-urile mele"
                        icon={<IconLiveView />}
                        color="indigo.8"
                        styles={() => ({
                            label: {
                                color: colors.black,
                                fontSize: '1rem',
                                fontWeight: pathname.includes('reviews') && '600',
                            },
                        })}
                    />
                </div>
                <div className="flex flex-row">
                    <NavLink
                        onClick={() => {
                            router?.push('/map');
                        }}
                        active={pathname.includes('map')}
                        label="Hartă"
                        icon={<IconCategory />}
                        color="indigo.8"
                        styles={() => ({
                            label: {
                                color: colors.black,
                                fontSize: '1rem',
                                fontWeight: pathname.includes('map') && '600',
                            },
                        })}
                    />
                </div>
            </div>

            {/* Partea de jos */}
            <div className="mt-auto">
                <NavLink
                    className=""
                    label="Deloghează-mă"
                    icon={<IconLogout2 />}
                    styles={() => ({
                        label: {
                            color: colors.black,
                            fontSize: '1rem',
                        },
                    })}
                    onClick={() => {
                        logout();
                    }}
                />
            </div>
        </div>
    );
}

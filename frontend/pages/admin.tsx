import AdminTable from "@/contents/components/adminTable/AdminTable";
import { ProfileContext } from "@/contexts/ProfileContext";
import { AdminServices } from "@/services/admin/AdminServices";
import { Button } from "@mantine/core";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

export default function Admin() {
    const [data, setData] = useState<any>([]);
    const router = useRouter();
    const {logout} = useContext(ProfileContext);

    useEffect(() => {
        AdminServices.getAllUsers().then((res) => {
            console.log(res?.data);
            setData(res?.data?.users);
        });
    }, []);

    return (
        <div className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center flex-col" style={{ backgroundImage: 'url("admin_bg.jpg")' }}>
            <AdminTable data={data} setData={setData} />
            <Button className="mt-8 w-[67.5%]" color="blue.8" size="lg" onClick={() => {
                logout();
            }}>Log out</Button>
        </div>
    );
}

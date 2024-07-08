import { ReactNode, } from "react";

export default function Container({ props, children, }: { props?: any, children: ReactNode; }) {
    return (
        <div className="max-w-[1127px] mt-4 mx-auto container-shadow">
            {children}
        </div>
    );
}
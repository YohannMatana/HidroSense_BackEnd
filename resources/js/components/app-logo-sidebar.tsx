import AppLogoIconSideBar from './app-logo-icon-sidebar';

export default function AppLogoSideBar() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIconSideBar className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    HidroSense Monitor
                </span>
            </div>
        </>
    );
}

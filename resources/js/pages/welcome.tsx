import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bem-vindo">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Painel
                            </Link>
                        ) : (
                            <>
                            <AppearanceToggleDropdown />
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Entrar
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Cadastrar
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">

                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-lg bg-gray-200 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-l-lg lg:rounded-r-lg dark:bg-gray-400 flex items-center justify-center">
                            <div
                                className="w-full max-w-none translate-y-0 text-[#F53003] opacity-100 transition-all duration-750 dark:text-[#F61500] starting:translate-y-6 starting:opacity-0 absolute top-0 left-0"
                            >
                                {/* Text HidroSense */}
                            </div>
                            <div
                                className=" w-[280px] h-[220px] lg:w-[448px] lg:h-[376px] dark:hidden flex items-center justify-center"
                            >
                                <div className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0">
                                    <img
                                        src="/images/tiny-hidrosense-LOGO-nobg-500x500.png"
                                        width="350"
                                        height="350"
                                        className="max-w-[240px] max-h-[240px] lg:max-w-[350px] lg:max-h-[350px]"
                                        alt="HidroSense Logo"
                                    />
                                </div>
                            </div>
                            <div
                                className="hidden w-[280px] h-[220px] lg:w-[448px] lg:h-[376px] dark:flex items-center justify-center"
                            >
                                <div className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0">
                                    <img
                                        src="/images/tiny-hidrosense-LOGO-nobg-500x500.png"
                                        width="350"
                                        height="350"
                                        className="max-w-[240px] max-h-[240px] lg:max-w-[350px] lg:max-h-[350px]"
                                        alt="HidroSense Logo"
                                    />
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-l-lg lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}




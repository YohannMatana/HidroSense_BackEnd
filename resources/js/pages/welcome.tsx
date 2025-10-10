import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
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
                                Dashboard
                            </Link>
                        ) : (
                            <>
                            <AppearanceToggleDropdown />
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">

                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-[#fff2f2] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:bg-[#1D0002]">
                            <svg
                                className="w-full max-w-none translate-y-0 text-[#F53003] opacity-100 transition-all duration-750 dark:text-[#F61500] starting:translate-y-6 starting:opacity-0"
                                viewBox="0 0 438 104"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Text HidroSense */}
                            </svg>
                            <svg
                                className="relative -mt-[4.9rem] -ml-8 w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:hidden"
                                viewBox="0 0 440 376"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                
                                <g className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0">
                                {/* Light HidroSense Logo */}
                                </g>

                                <g
                                    style={{ mixBlendMode: 'hard-light' }}
                                    className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0"
                                >
                                    {/* Light HidroSense Logo2 */}
                                </g>
                            </svg>
                            <svg
                                className="relative -mt-[4.9rem] -ml-8 hidden w-[448px] max-w-none lg:-mt-[6.6rem] lg:ml-0 dark:block"
                                viewBox="0 0 440 376"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g
                                    className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0"
                                    style={{ mixBlendMode: 'hard-light' }}
                                    >
                                    {/* Dark HidroSense Logo */}

                                </g>
                                <g
                                    className="translate-y-0 opacity-100 transition-all delay-300 duration-750 starting:translate-y-4 starting:opacity-0"
                                    style={{ mixBlendMode: 'hard-light' }}
                                >
                                    {/* Dark HidroSense Logo2 */}
                                </g>
                            </svg>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}

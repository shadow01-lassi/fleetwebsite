'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { createPortal } from 'react-dom';
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { LucideIcon } from 'lucide-react';
import {
	CodeIcon,
	GlobeIcon,
	LayersIcon,
	UserPlusIcon,
	Users,
	Star,
	FileText,
	Shield,
	RotateCcw,
	Handshake,
	Leaf,
	HelpCircle,
	BarChart,
	PlugIcon,
} from 'lucide-react';

type LinkItem = {
	title: string;
	href: string;
	icon: LucideIcon;
	description?: string;
};

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

	return (
		<header
			className={cn('fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-transparent', {
				'bg-[#070a13]/80 supports-[backdrop-filter]:bg-[#070a13]/50 border-white/5 backdrop-blur-lg':
					scrolled || open,
			})}
		>
			<nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
				<div className="flex items-center gap-8">
					<a href="/" className="flex items-center gap-2 hover:opacity-90">
						<div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-indigo-600 flex items-center justify-center shadow-lg">
							<Shield className="w-4 h-4 text-black font-extrabold" />
						</div>
						<span className="text-sm font-black text-white uppercase tracking-widest leading-none">Fleetly</span>
					</a>
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider">Features</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-slate-950 p-1 pr-1.5 border border-white/5 rounded-2xl shadow-2xl">
									<ul className="bg-slate-950 grid w-[500px] grid-cols-2 gap-2 rounded-2xl p-2">
										{productLinks.map((item, i) => (
											<li key={i}>
												<ListItem {...item} />
											</li>
										))}
									</ul>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuTrigger className="bg-transparent text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider">Solutions</NavigationMenuTrigger>
								<NavigationMenuContent className="bg-slate-950 p-1 pr-1.5 pb-1.5 border border-white/5 rounded-2xl shadow-2xl">
									<div className="grid w-[500px] grid-cols-2 gap-2">
										<ul className="bg-slate-950 space-y-1 rounded-2xl p-2">
											{companyLinks.map((item, i) => (
												<li key={i}>
													<ListItem {...item} />
												</li>
											))}
										</ul>
										<ul className="space-y-1 p-3">
											{companyLinks2.map((item, i) => (
												<li key={i}>
													<NavigationMenuLink
														href={item.href}
														className="flex p-2 hover:bg-white/5 flex-row rounded-xl items-center gap-x-3 text-slate-400 hover:text-white transition-colors"
													>
														<item.icon className="size-4 text-teal-400" />
														<span className="font-semibold text-xs uppercase tracking-wider">{item.title}</span>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</div>
								</NavigationMenuContent>
							</NavigationMenuItem>
							<NavigationMenuLink className="px-4" asChild>
								<a href="#pricing" className="hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-xs uppercase tracking-wider rounded-xl p-2 transition-all">
									Pricing
								</a>
							</NavigationMenuLink>
						</NavigationMenuList>
					</NavigationMenu>
				</div>
				<div className="hidden items-center gap-3 md:flex">
					<Button variant="ghost" asChild className="text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer">
						<a href="/login">Sign In</a>
					</Button>
					<Button asChild className="bg-gradient-to-t from-teal-500 to-teal-400 hover:from-teal-600 hover:to-teal-500 text-black font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer border border-teal-400 shadow-lg shadow-teal-500/10">
						<a href="/admin/dashboard">Go to Dashboard</a>
					</Button>
				</div>
				<Button
					size="icon"
					variant="outline"
					onClick={() => setOpen(!open)}
					className="md:hidden border-white/10 hover:bg-white/5 cursor-pointer"
					aria-expanded={open}
					aria-controls="mobile-menu"
					aria-label="Toggle menu"
				>
					<MenuToggleIcon open={open} className="text-white" duration={300} />
				</Button>
			</nav>
			<MobileMenu open={open} className="flex flex-col justify-between gap-6 overflow-y-auto pt-6">
				<NavigationMenu className="max-w-full">
					<div className="flex w-full flex-col gap-y-4">
						<span className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-white/5 pb-1">Features</span>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{productLinks.map((link) => (
								<ListItem key={link.title} {...link} onClick={() => setOpen(false)} />
							))}
						</div>
						<span className="text-[10px] font-black uppercase tracking-widest text-teal-400 border-b border-white/5 pb-1">Solutions</span>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{companyLinks.map((link) => (
								<ListItem key={link.title} {...link} onClick={() => setOpen(false)} />
							))}
						</div>
						<div className="grid grid-cols-2 gap-2 mt-2">
							{companyLinks2.map((link) => (
								<a
									key={link.title}
									href={link.href}
									onClick={() => setOpen(false)}
									className="flex p-2 hover:bg-white/5 flex-row rounded-xl items-center gap-x-2 text-slate-400 hover:text-white"
								>
									<link.icon className="size-4 text-teal-400" />
									<span className="font-semibold text-[10px] uppercase tracking-wider">{link.title}</span>
								</a>
							))}
						</div>
					</div>
				</NavigationMenu>
				<div className="flex flex-col gap-3 pb-8">
					<Button variant="outline" asChild className="w-full bg-transparent border-white/10 text-white font-bold text-xs uppercase tracking-wider cursor-pointer">
						<a href="/login" onClick={() => setOpen(false)}>Sign In</a>
					</Button>
					<Button asChild className="w-full bg-gradient-to-t from-teal-500 to-teal-400 text-black font-black text-xs uppercase tracking-wider cursor-pointer">
						<a href="/admin/dashboard" onClick={() => setOpen(false)}>Go to Dashboard</a>
					</Button>
				</div>
			</MobileMenu>
		</header>
	);
}

type MobileMenuProps = React.ComponentProps<'div'> & {
	open: boolean;
};

function MobileMenu({ open, children, className, ...props }: MobileMenuProps) {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => {
		setMounted(true);
		return () => setMounted(false);
	}, []);

	if (!open || !mounted) return null;

	return createPortal(
		<div
			id="mobile-menu"
			className={cn(
				'bg-[#070a13]/95 backdrop-blur-xl border-t border-white/5',
				'fixed top-16 right-0 bottom-0 left-0 z-40 flex flex-col overflow-hidden md:hidden',
			)}
		>
			<div
				data-slot={open ? 'open' : 'closed'}
				className={cn(
					'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 ease-out duration-200',
					'size-full p-6',
					className,
				)}
				{...props}
			>
				{children}
			</div>
		</div>,
		document.body,
	);
}

function ListItem({
	title,
	description,
	icon: Icon,
	className,
	href,
	onClick,
	...props
}: React.ComponentProps<typeof NavigationMenuLink> & LinkItem & { onClick?: () => void }) {
	return (
		<NavigationMenuLink className={cn('w-full flex flex-row gap-x-3 items-center hover:bg-white/5 rounded-xl p-2 transition-colors cursor-pointer', className)} {...props} asChild>
			<a href={href} onClick={onClick}>
				<div className="bg-slate-900 flex aspect-square size-10 items-center justify-center rounded-xl border border-white/5 shadow-inner">
					<Icon className="text-teal-400 size-5" />
				</div>
				<div className="flex flex-col items-start justify-center">
					<span className="font-bold text-white text-xs uppercase tracking-wider">{title}</span>
					{description && <span className="text-slate-400 text-[10px] leading-tight mt-0.5">{description}</span>}
				</div>
			</a>
		</NavigationMenuLink>
	);
}

const productLinks: LinkItem[] = [
	{
		title: 'Real-Time Map',
		href: '/admin/live-map',
		description: 'Track vehicle telemetry logs in high frequency.',
		icon: GlobeIcon,
	},
	{
		title: 'GPS Tracking',
		href: '/admin/live-map',
		description: 'Online trackers feed active positions seamlessly.',
		icon: LayersIcon,
	},
	{
		title: 'Manage Fleet',
		href: '/admin/manage-fleet',
		description: 'Searchable database grid for plates and models.',
		icon: UserPlusIcon,
	},
	{
		title: 'Telemetry Graphs',
		href: '/admin/dashboard',
		description: 'Visual Recharts graphs track velocities and battery.',
		icon: BarChart,
	},
	{
		title: 'Checklist Audits',
		href: '/admin/rentals',
		description: 'Approve checklist reports uploaded by drivers.',
		icon: PlugIcon,
	},
	{
		title: 'Executive Console',
		href: '/admin/dashboard',
		description: 'Direct ignition locks and active warning alerts.',
		icon: CodeIcon,
	},
];

const companyLinks: LinkItem[] = [
	{
		title: 'Driver Auditing',
		href: '/admin/approve-drivers',
		description: 'Review licensing and utility bill images.',
		icon: Users,
	},
	{
		title: 'Rentals Monitor',
		href: '/admin/rentals',
		description: 'Timeline logs of active contracts and returns.',
		icon: Star,
	},
	{
		title: 'Security Rules',
		href: '/admin/dashboard',
		description: 'Robust authentication rejecting non-admin roles.',
		icon: Handshake,
	},
];

const companyLinks2: LinkItem[] = [
	{
		title: 'Terms',
		href: '#',
		icon: FileText,
	},
	{
		title: 'Privacy',
		href: '#',
		icon: Shield,
	},
	{
		title: 'Refunds',
		href: '#',
		icon: RotateCcw,
	},
	{
		title: 'Compliance',
		href: '#',
		icon: Leaf,
	},
	{
		title: 'Support',
		href: '#',
		icon: HelpCircle,
	},
];

function useScroll(threshold: number) {
	const [scrolled, setScrolled] = React.useState(false);

	const onScroll = React.useCallback(() => {
		setScrolled(window.scrollY > threshold);
	}, [threshold]);

	React.useEffect(() => {
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, [onScroll]);

	React.useEffect(() => {
		onScroll();
	}, [onScroll]);

	return scrolled;
}

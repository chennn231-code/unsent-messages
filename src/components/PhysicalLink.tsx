import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link, NavLink, type LinkProps, type NavLinkProps } from "react-router";

interface FeedbackOptions {
  feedback?: "soft" | "envelope";
  idlePeriod?: number;
  idle?: boolean;
}
function usePhysicalFeedback({
  feedback = "soft",
  idlePeriod = 3.6,
  idle = true,
}: FeedbackOptions) {
  const [phase, setPhase] = useState<"idle" | "pressed" | "release">("idle");
  const element = useRef<HTMLAnchorElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    if (!idle) return;
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    const observer =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(([entry]) => setInView(entry.isIntersecting))
        : null;
    if (element.current) observer?.observe(element.current);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [idle]);
  const pointer = useRef<{
    id: number;
    type: string;
    x: number;
    y: number;
    moved: boolean;
  } | null>(null);
  const reducedMotion = () =>
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const reset = () => {
    pointer.current = null;
    setPhase("idle");
  };
  return {
    ref: element,
    className: "physical-target",
    "data-idle": idle && inView && pageVisible ? "true" : "false",
    style: {
      "--idle-period": `${idlePeriod}s`,
      "--idle-delay": `${-idlePeriod * 0.4}s`,
    } as CSSProperties,
    "data-feedback": feedback,
    "data-phase": phase,
    onPointerDown(event: PointerEvent<HTMLAnchorElement>) {
      if (!event.isPrimary || event.button !== 0) return;
      pointer.current = {
        id: event.pointerId,
        type: event.pointerType,
        x: event.clientX,
        y: event.clientY,
        moved: false,
      };
      if (!reducedMotion()) {
        setPhase("pressed");
        if (
          event.pointerType === "touch" &&
          typeof navigator.vibrate === "function"
        ) {
          try {
            navigator.vibrate(10);
          } catch {
            /* Optional haptics never block a link. */
          }
        }
      }
    },
    onPointerMove(event: PointerEvent<HTMLAnchorElement>) {
      const active = pointer.current;
      if (!active || active.id !== event.pointerId) return;
      if (Math.hypot(event.clientX - active.x, event.clientY - active.y) > 10) {
        active.moved = true;
        setPhase("idle");
      }
    },
    onPointerUp(event: PointerEvent<HTMLAnchorElement>) {
      const active = pointer.current;
      if (!active || active.id !== event.pointerId) return;
      pointer.current = null;
      const box = event.currentTarget.getBoundingClientRect();
      const inside =
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      if (active.moved || !inside) {
        setPhase("idle");
        return;
      }
      if (!reducedMotion()) {
        setPhase("release");
      }
    },
    onPointerCancel: reset,
    onPointerLeave: reset,
    onBlur: reset,
    onKeyDown(event: React.KeyboardEvent<HTMLAnchorElement>) {
      if (event.key === "Enter" && !event.repeat && !reducedMotion())
        setPhase("release");
    },
    onAnimationEnd(event: React.AnimationEvent<HTMLAnchorElement>) {
      if (
        event.target === event.currentTarget.firstElementChild &&
        event.animationName === "physical-release"
      )
        setPhase("idle");
    },
  };
}
export function PhysicalLink({
  feedback,
  idlePeriod,
  idle,
  children,
  style,
  className = "",
  ...props
}: LinkProps & FeedbackOptions) {
  const interaction = usePhysicalFeedback({ feedback, idlePeriod, idle });
  return (
    <Link
      {...props}
      {...interaction}
      style={{ ...interaction.style, ...style }}
      className={`${className} ${interaction.className}`.trim()}
    >
      <span className="tactile-surface">
        {children}
        <span className="touch-echo" aria-hidden="true" />
      </span>
    </Link>
  );
}
export function PhysicalNavLink({
  feedback,
  idlePeriod,
  idle,
  children,
  style,
  className = "",
  ...props
}: Omit<NavLinkProps, "className" | "children" | "style"> &
  FeedbackOptions & {
    className?: string;
    children?: ReactNode;
    style?: CSSProperties;
  }) {
  const interaction = usePhysicalFeedback({ feedback, idlePeriod, idle });
  return (
    <NavLink
      {...props}
      {...interaction}
      style={{ ...interaction.style, ...style }}
      className={`${className} ${interaction.className}`.trim()}
    >
      <span className="tactile-surface">
        {children}
        <span className="touch-echo" aria-hidden="true" />
      </span>
    </NavLink>
  );
}

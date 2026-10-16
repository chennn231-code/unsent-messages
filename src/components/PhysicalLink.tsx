import { useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { Link, NavLink, type LinkProps, type NavLinkProps } from "react-router";

interface FeedbackOptions {
  feedback?: "soft" | "envelope";
  idlePeriod?: number;
}
function usePhysicalFeedback({
  feedback = "soft",
  idlePeriod = 3.6,
}: FeedbackOptions) {
  const [phase, setPhase] = useState<"idle" | "pressed" | "release">("idle");
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
    className: "physical-target",
    style: { "--idle-period": `${idlePeriod}s` } as CSSProperties,
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
      if (!reducedMotion()) setPhase("pressed");
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
        if (
          active.type === "touch" &&
          typeof navigator.vibrate === "function"
        ) {
          try {
            navigator.vibrate(10);
          } catch {
            /* Haptics are optional and never block navigation. */
          }
        }
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
        event.target === event.currentTarget &&
        event.animationName === "physical-release"
      )
        setPhase("idle");
    },
  };
}
export function PhysicalLink({
  feedback,
  idlePeriod,
  className = "",
  ...props
}: LinkProps & FeedbackOptions) {
  const interaction = usePhysicalFeedback({ feedback, idlePeriod });
  return (
    <Link
      {...props}
      {...interaction}
      className={`${className} ${interaction.className}`.trim()}
    />
  );
}
export function PhysicalNavLink({
  feedback,
  idlePeriod,
  className = "",
  ...props
}: Omit<NavLinkProps, "className"> & FeedbackOptions & { className?: string }) {
  const interaction = usePhysicalFeedback({ feedback, idlePeriod });
  return (
    <NavLink
      {...props}
      {...interaction}
      className={`${className} ${interaction.className}`.trim()}
    />
  );
}

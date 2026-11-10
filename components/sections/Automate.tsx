'use client';

import { useCallback, useRef } from 'react';
import { LazyVideo } from '@/components/LazyVideo';
import { hasWorkflowVideo } from '@/lib/content';
import { ease, lerp, usePinnedProgress } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';

function WorkflowMock() {
  return (
    <>
      <div className="wf-bar mono">
        <span>Workflows</span>
        <span className="live">● running</span>
      </div>
      <div className="wf-canvas">
        <div className="wf-row">
          <div className="wf-node trig"><small>Trigger</small>Alert received</div>
          <i className="wf-link" />
          <div className="wf-node"><small>Condition</small>Severity ≥ high</div>
          <i className="wf-link" />
          <div className="wf-node"><small>Action</small>Enrich IoCs</div>
          <i className="wf-link" />
          <div className="wf-node grp"><small>Group</small>Notify &amp; escalate</div>
        </div>
      </div>
    </>
  );
}

/** Pinned: zoom into the `automate` command, then travel down to the workflow demo. */
export function Automate() {
  const { t } = useI18n();
  const section = useRef<HTMLElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  const onProgress = useCallback((p: number) => {
    const h = head.current;
    const f = frame.current;
    if (!h || !f) return;
    const vh = window.innerHeight;
    const zoomIn = ease(0, 0.3, p);
    const travel = ease(0.3, 0.72, p);
    const headFinal = 36 - f.offsetHeight / 2 - 56;
    const s = lerp(lerp(1, 2.6, zoomIn), 0.85, travel);
    h.style.transform = `translate(-50%, -50%) translateY(${lerp(0, headFinal, travel)}px) scale(${s})`;
    h.style.opacity = String(1 - 0.15 * travel);
    f.style.transform = `translate(-50%, -50%) translateY(${lerp(vh * 0.85, 36, travel)}px) scale(${lerp(0.86, 1, travel)})`;
    f.style.opacity = String(ease(0.3, 0.5, p));
  }, []);
  usePinnedProgress(section, onProgress);

  return (
    <section className="auto" id="automate" ref={section} aria-label={t.automate.label}>
      <div className="auto-sticky">
        <div className="auto-head" ref={head}>
          <span className="auto-cmd mono">
            <span className="p">›</span> automate
          </span>
          <p className="auto-sub">{t.automate.sub}</p>
        </div>
        <div className="auto-frame" ref={frame}>
          {hasWorkflowVideo ? (
            <LazyVideo src="/videos/workflows.mp4" poster="/videos/workflows.jpg" />
          ) : (
            <WorkflowMock />
          )}
        </div>
      </div>
    </section>
  );
}

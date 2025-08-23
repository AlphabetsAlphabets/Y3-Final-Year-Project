<script lang="ts">
    import { Calendar, Interaction, TimeGrid } from "@event-calendar/core";

    import Modal from "$lib/components/Modal.svelte";
    import EditLogModal from "./EditLogModal.svelte";

    import { updateEventTime, type CalendarEvent } from "./calendar";
    import { updateLog } from "./log";

    let {
        dbWorker,
        events,
        refresh, // calls a method defined in the parent component to change the parent's state.
    } = $props();

    let modal: Modal | null = $state(null);
    let targetEvent: CalendarEvent | undefined = $state();
    let isDragging = $state(false);
    let isMobile = $state(false);

    // Detect mobile device
    function detectMobile() {
        if (typeof window !== "undefined") {
            isMobile =
                window.innerWidth <= 768 ||
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent,
                );
        }
    }

    // Initialize mobile detection on component mount
    $effect(() => {
        detectMobile();
        if (typeof window !== "undefined") {
            window.addEventListener("resize", detectMobile);
            return () => window.removeEventListener("resize", detectMobile);
        }
    });

    // Mobile touch support - prevent body scroll during drag
    function preventBodyScroll() {
        if (typeof document !== "undefined") {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        }
    }

    function restoreBodyScroll() {
        if (typeof document !== "undefined") {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
    }

    async function handleEventChange(arg: { event: CalendarEvent }) {
        let newStart = new Date(arg.event.start);
        let newEnd = new Date(arg.event.end);

        let toUpdate = await updateEventTime(newStart, newEnd);
        console.log("Resize toUpdate: ", toUpdate);

        await updateLog(dbWorker, toUpdate.join(", "), `id = ${arg.event.id}`);
    }

    function handleEventDragStart() {
        isDragging = true;
        preventBodyScroll();
    }

    function handleEventDragStop() {
        isDragging = false;
        restoreBodyScroll();
    }

    let options = $state({
        view: "timeGridWeek",
        events: events,
        eventDidMount: function (arg: { event: CalendarEvent }) {
            arg.el.addEventListener("click", () => {
                // Only open modal if not dragging
                if (!isDragging) {
                    targetEvent = arg.event;
                    modal?.showModal();
                }
            });
        },
        eventDrop: handleEventChange,
        eventResize: handleEventChange,
        eventDragStart: handleEventDragStart,
        eventDragStop: handleEventDragStop,
        eventResizeStart: handleEventDragStart,
        eventResizeStop: handleEventDragStop,
        editable: true,
        // Mobile touch support configuration
        pointer: true, // Enable pointer events for better touch interaction
        eventDragMinDistance: isMobile ? 15 : 5, // Higher threshold for mobile
        dragScroll: true, // Enable auto-scrolling when dragging near edges

        // Touch-friendly view settings
        views: {
            timeGridWeek: {
                pointer: true,
                eventDragMinDistance: isMobile ? 15 : 5,
            },
            timeGridDay: {
                pointer: true,
                eventDragMinDistance: isMobile ? 15 : 5,
            },
        },
    });
</script>

<!-- Mobile touch instructions -->
{#if isMobile}
    <div class="mobile-instructions alert alert-info mb-3">
        <small>
            <strong>Mobile Tip:</strong> Tap and hold an event for a moment to drag
            or resize it on touch devices.
        </small>
    </div>
{/if}

<EditLogModal
    {dbWorker}
    bind:modal
    bind:event={targetEvent}
    updateEvent={async () => {
        await refresh();
    }}
/>

<Calendar plugins={[TimeGrid, Interaction]} {options} />

<style>
    /* Mobile instructions styling */
    .mobile-instructions {
        font-size: 0.9rem;
        border: 1px solid #bee5eb;
        background-color: #d1ecf1;
        color: #0c5460;
        padding: 8px 12px;
        border-radius: 4px;
    }

    /* Mobile touch support styles */
    :global(.ec) {
        /* Prevent default touch behaviors that interfere with dragging */
        touch-action: none;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Improve touch targets for mobile */
    :global(.ec-event) {
        /* Ensure events are large enough for touch interaction */
        min-height: 30px;
        /* Add some padding for better touch targets */
        padding: 2px 4px;
        /* Prevent text selection during drag */
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        /* Enable hardware acceleration for smoother animations */
        transform: translateZ(0);
        will-change: transform;
    }

    /* Style for events being dragged on touch devices */
    :global(.ec-event.ec-dragging) {
        /* Add visual feedback during drag */
        opacity: 0.8;
        transform: scale(1.05) translateZ(0);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transition: none; /* Disable transitions during drag for better performance */
    }

    /* Haptic feedback simulation for touch devices */
    :global(.ec-event:active) {
        transform: scale(0.98);
        transition: transform 0.1s ease;
    }

    /* Improve resize handles for touch */
    :global(.ec-event-resizer) {
        /* Make resize handles more touch-friendly */
        width: 12px;
        height: 12px;
        opacity: 0.8;
    }

    /* Mobile-specific adjustments */
    @media (max-width: 768px) {
        :global(.ec-event) {
            /* Larger touch targets on mobile */
            min-height: 35px;
            padding: 4px 6px;
        }

        :global(.ec-event-resizer) {
            /* Larger resize handles on mobile */
            width: 16px;
            height: 16px;
        }

        /* Improve scrolling on mobile */
        :global(.ec-scroller) {
            -webkit-overflow-scrolling: touch;
        }
    }

    /* Prevent scrolling when dragging events */
    :global(body.ec-dragging) {
        overflow: hidden;
        position: fixed;
        width: 100%;
    }

    /* Mobile-specific touch enhancements */
    @media (hover: none) and (pointer: coarse) {
        /* This targets touch devices specifically */
        :global(.ec-event) {
            /* Add visual indication that events are interactive */
            cursor: grab;
        }

        :global(.ec-event:active) {
            cursor: grabbing;
        }

        /* Improve tap targets */
        :global(.ec-event-content) {
            padding: 6px 8px;
        }

        /* Better visual feedback for touch interactions */
        :global(.ec-event:hover) {
            transform: translateZ(0);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Touch-friendly selection state */
        :global(.ec-event.ec-selected) {
            border: 2px solid #007bff;
            box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
    }

    /* High DPI mobile displays */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
        :global(.ec-event-resizer) {
            /* Sharper resize handles on retina displays */
            background-size: contain;
        }
    }
</style>

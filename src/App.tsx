/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Disc3, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ThreeUniverse } from './three/ThreeUniverse';
import { soundEngine } from './audio/soundEngine';
import {
  getStoredMemories,
  addCustomMemory,
  MemoryPhoto,
} from './data/galleryData';
import { SceneNarrative } from './components/SceneNarrative';
import { AudioPlayerDock } from './components/AudioPlayerDock';
import { PhotoModal } from './components/PhotoModal';
import { LetterModal } from './components/LetterModal';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const universeRef = useRef<ThreeUniverse | null>(null);

  // Application State
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [memories, setMemories] = useState<MemoryPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<MemoryPhoto | null>(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState<boolean>(false);
  const [isAudioDockOpen, setIsAudioDockOpen] = useState<boolean>(false);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Initialize memories from storage
  useEffect(() => {
    const loadedMemories = getStoredMemories();
    setMemories(loadedMemories);
  }, []);

  // Sync music play state
  useEffect(() => {
    const unsub = soundEngine.subscribe(() => {
      setIsPlayingMusic(soundEngine.isPlaying);
    });
    return () => {
      unsub();
    };
  }, []);

  // Initialize Three.js Universe
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const universe = new ThreeUniverse(canvasMountRef.current, {
      onPhotoSelected: (photo) => {
        setSelectedPhoto(photo);
        setIsPhotoModalOpen(true);
      },
      onSceneChange: (sceneIdx) => {
        setCurrentScene(sceneIdx);
      },
      onFirstInteraction: () => {
        handleFirstUserInteraction();
      },
      onEnvelopeOpened: () => {
        setIsLetterModalOpen(true);
      },
    });

    universeRef.current = universe;

    // Load initial memories into 3D cylinder
    universe.buildGalleryConstellation(getStoredMemories());

    return () => {
      universe.dispose();
      universeRef.current = null;
    };
  }, []);

  // Update 3D Gallery when memories change
  useEffect(() => {
    if (universeRef.current && memories.length > 0) {
      universeRef.current.buildGalleryConstellation(memories);
    }
  }, [memories]);

  // Adjust camera FOV based on screen aspect ratio to ensure central content is always framed perfectly on both desktop and mobile
  useEffect(() => {
    const handleAspectChange = () => {
      if (universeRef.current) {
        universeRef.current.updateCameraFov();
      }
    };

    window.addEventListener('resize', handleAspectChange);
    window.addEventListener('orientationchange', handleAspectChange);
    handleAspectChange();

    return () => {
      window.removeEventListener('resize', handleAspectChange);
      window.removeEventListener('orientationchange', handleAspectChange);
    };
  }, []);

  // First interaction handler (starts music & unlocks Scene 1 -> 2)
  const handleFirstUserInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
      soundEngine.startAudio();
      if (universeRef.current && currentScene === 1) {
        universeRef.current.setScene(2);
        setCurrentScene(2);
      }
    }
  }, [hasInteracted, currentScene]);

  // Scene Navigation
  const handleSelectScene = useCallback((sceneNum: number) => {
    if (!hasInteracted) {
      handleFirstUserInteraction();
    }
    setCurrentScene(sceneNum);
    if (universeRef.current) {
      universeRef.current.setScene(sceneNum);

      // Trigger grand celebratory confetti when reaching Scene 6
      if (sceneNum === 6) {
        launchCelebrationConfetti();
      }
    }
  }, [hasInteracted, handleFirstUserInteraction]);

  const handleNextScene = useCallback(() => {
    const next = currentScene < 6 ? currentScene + 1 : 1;
    handleSelectScene(next);
  }, [currentScene, handleSelectScene]);

  const handlePrevScene = useCallback(() => {
    const prev = currentScene > 1 ? currentScene - 1 : 6;
    handleSelectScene(prev);
  }, [currentScene, handleSelectScene]);

  // Continuous Seamless Cinematic Auto-Progression (every 14s)
  useEffect(() => {
    if (!hasInteracted || isPhotoModalOpen || isLetterModalOpen) return;

    const timer = setInterval(() => {
      setCurrentScene((prev) => {
        const next = prev < 6 ? prev + 1 : 1;
        if (universeRef.current) {
          universeRef.current.setScene(next);
          if (next === 6) launchCelebrationConfetti();
        }
        return next;
      });
    }, 14000);

    return () => clearInterval(timer);
  }, [hasInteracted, isPhotoModalOpen, isLetterModalOpen]);

  // Grand finale confetti burst
  const launchCelebrationConfetti = () => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#f472b6', '#ec4899', '#fde047', '#ffffff', '#fda4af'];

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // safe fallback if confetti fails
    }
  };

  // Adding Custom Memory Photo
  const handleAddCustomPhoto = (newPhoto: Omit<MemoryPhoto, 'id'>) => {
    const created = addCustomMemory(newPhoto);
    setMemories((prev) => [created, ...prev]);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 touch-none select-none"
      onClick={handleFirstUserInteraction}
    >
      {/* 1. Isolated WebGL 3D Canvas Container (Full drag, rotate, pinch-to-zoom) */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 z-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* 2. Seamless Cinematic Narrative — pure floating poetry, no boxes */}
      <SceneNarrative currentScene={currentScene} />

      {/* 3. Ultra-minimal edge arrows — only visible on hover, never dominate */}
      {hasInteracted && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevScene();
            }}
            className="fixed left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/20 hover:bg-black/55 border border-pink-400/10 text-pink-200/40 hover:text-white opacity-30 hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 active:scale-90"
            title="Chương trước"
            aria-label="Chương trước"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextScene();
            }}
            className="fixed right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/20 hover:bg-black/55 border border-pink-400/10 text-pink-200/40 hover:text-white opacity-30 hover:opacity-100 flex items-center justify-center backdrop-blur-[2px] transition-all duration-300 active:scale-90"
            title="Chương kế tiếp"
            aria-label="Chương kế tiếp"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* 4. Tiny progress dots — almost invisible until needed */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 pointer-events-auto opacity-50 hover:opacity-100 transition-opacity duration-500">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectScene(num);
            }}
            className={`transition-all duration-400 rounded-full ${
              currentScene === num
                ? 'w-5 h-1 bg-pink-400/90 shadow-[0_0_8px_#f472b6]'
                : 'w-1 h-1 bg-pink-300/25 hover:bg-pink-300/50'
            }`}
            title={`Chương ${num}`}
            aria-label={`Chương ${num}`}
          />
        ))}
      </div>

      {/* 5. Single discreet vinyl control — audio + manual import (required) */}
      <div className="fixed bottom-3 right-3 z-20 pointer-events-auto">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsAudioDockOpen(!isAudioDockOpen);
          }}
          className="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 border border-pink-500/25 shadow-md backdrop-blur-md flex items-center justify-center text-pink-300 hover:text-white transition-all active:scale-95 group"
          title="Âm nhạc & Tải bài hát"
          aria-label="Mở điều khiển âm nhạc"
        >
          <Disc3
            className={`w-4.5 h-4.5 text-pink-400 group-hover:text-pink-300 transition-transform ${
              isPlayingMusic ? 'animate-spin-slow' : ''
            }`}
          />
        </button>
      </div>

      {/* 6. Audio Player Dock (Shown only when user taps vinyl icon) */}
      <AudioPlayerDock
        isOpen={isAudioDockOpen}
        onClose={() => setIsAudioDockOpen(false)}
      />

      {/* 7. Photo Inspection & Memory Uploader Modal */}
      <PhotoModal
        photo={selectedPhoto}
        photos={memories}
        onClose={() => {
          setSelectedPhoto(null);
          setIsPhotoModalOpen(false);
        }}
        onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        onAddPhoto={handleAddCustomPhoto}
      />

      {/* 8. Handwritten Letter Modal */}
      <LetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
        onGoToFinale={() => handleSelectScene(6)}
      />
    </div>
  );
}

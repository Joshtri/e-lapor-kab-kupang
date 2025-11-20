'use client';

import { useRef, useState, useEffect } from 'react';
import { Progress, Spinner } from 'flowbite-react';
import { motion } from 'framer-motion';
import {
  HiOutlineMail,
  HiMailOpen,
  HiPaperAirplane,
  HiOutlineThumbUp,
  HiOutlineExclamationCircle,
} from 'react-icons/hi';

export default function StatsSection() {
  const statsRef = useRef(null);
  const [targetStats, setTargetStats] = useState({
    reports: 0,
    resolved: 0,
    inProgress: 0,
    satisfaction: 0,
  });

  const [stats, setStats] = useState({
    reports: 0,
    resolved: 0,
    inProgress: 0,
    satisfaction: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Fetch real data from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/public/stats');

        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }

        const data = await res.json();
        setTargetStats(data);
        setLoading(false);
      } catch (error) {
        'Gagal mengambil data statistik:', error;
        setError('Gagal memuat data statistik. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Stats animation effect
  useEffect(() => {
    if (loading || error || !targetStats || animationStarted) return;

    const isInViewport = (element) => {
      if (!element) return false;
      const rect = element.getBoundingClientRect();
      return rect.top < window.innerHeight && rect.bottom >= 0;
    };

    const handleScroll = () => {
      if (isInViewport(statsRef.current) && !animationStarted) {
        setAnimationStarted(true);

        const interval = setInterval(() => {
          setStats((prevStats) => {
            const newStats = { ...prevStats };
            let completed = true;

            Object.keys(targetStats).forEach((key) => {
              if (newStats[key] < targetStats[key]) {
                const increment = Math.ceil(targetStats[key] / 50);
                newStats[key] = Math.min(
                  newStats[key] + increment,
                  targetStats[key],
                );
                completed = false;
              }
            });

            if (completed) clearInterval(interval);
            return newStats;
          });
        }, 30);

        return () => clearInterval(interval);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check immediately in case the element is already in viewport
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, error, targetStats, animationStarted]);

  return (
    <div
      id="stats-section"
      ref={statsRef}
      className="bg-blue-50 py-16 dark:bg-gray-800"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <HiOutlineMail className="text-blue-600 dark:text-blue-400 h-8 w-8" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-4">
            Transparansi Pengaduan
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Kami berkomitmen untuk transparansi dalam menangani setiap pengaduan
            masyarakat. Berikut adalah statistik pengaduan terkini:
          </p>
        </motion.div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Spinner size="xl" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              Memuat data statistik...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800/30 text-center">
            <HiOutlineExclamationCircle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-3" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-md border-t-4 border-blue-500"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                  <HiOutlineMail className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2 text-center">
                {stats.reports}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Total Laporan
              </p>
              <div className="mt-4 h-1 w-full bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <div
                  className="h-1 bg-blue-500 rounded-full"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-md border-t-4 border-green-500"
            >
              <div className="text-green-600 dark:text-green-400 mb-4 flex justify-center">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                  <HiMailOpen className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2 text-center">
                {stats.resolved}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Laporan Terselesaikan
              </p>
              <div className="mt-4 h-1 w-full bg-green-100 dark:bg-green-900/30 rounded-full">
                <div
                  className="h-1 bg-green-500 rounded-full"
                  style={{
                    width: `${stats.reports > 0 ? (stats.resolved / stats.reports) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-md border-t-4 border-yellow-500"
            >
              <div className="text-yellow-600 dark:text-yellow-400 mb-4 flex justify-center">
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                  <HiPaperAirplane className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-200 mb-2 text-center">
                {stats.inProgress}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Dalam Proses
              </p>
              <div className="mt-4 h-1 w-full bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
                <div
                  className="h-1 bg-yellow-500 rounded-full"
                  style={{
                    width: `${stats.reports > 0 ? (stats.inProgress / stats.reports) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-slate-700 rounded-lg p-6 shadow-md border-t-4 border-purple-500"
            >
              <div className="text-purple-600 dark:text-purple-400 mb-4 flex justify-center">
                <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                  <HiOutlineThumbUp className="h-8 w-8" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-2">
                <h3 className="text-4xl font-bold text-gray-900 dark:text-gray-200">
                  {stats.satisfaction}%
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Tingkat Kepuasan
              </p>
              <Progress
                progress={stats.satisfaction}
                color="purple"
                className="mt-4"
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

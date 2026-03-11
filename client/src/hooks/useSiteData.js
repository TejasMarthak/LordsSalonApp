import { useState, useEffect } from "react";
import axios from "axios";
import config from "../config";

/**
 * Custom hook to fetch and manage site data from API
 * Provides caching and automatic updates
 */
export const useSiteData = () => {
  const [data, setData] = useState({
    services: [],
    portfolio: [],
    settings: null,
    hero: null,
    loading: true,
    error: null,
  });

  // Fetch all site data
  const fetchSiteData = async () => {
    try {
      setData((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch data in parallel
      const [servicesRes, portfolioRes, settingsRes] = await Promise.all([
        axios
          .get(`${config.api.baseUrl}/api/services`)
          .catch(() => ({ data: [] })),
        axios
          .get(`${config.api.baseUrl}/api/portfolio?featured=true`)
          .catch(() => ({ data: [] })),
        axios
          .get(`${config.api.baseUrl}/api/site-settings`)
          .catch(() => ({ data: null })),
      ]);

      setData({
        services: servicesRes.data || [],
        portfolio: portfolioRes.data || [],
        settings: settingsRes.data || null,
        loading: false,
        error: null,
      });

      // Cache data
      localStorage.setItem(
        "siteData",
        JSON.stringify({
          services: servicesRes.data || [],
          portfolio: portfolioRes.data || [],
          settings: settingsRes.data || null,
          timestamp: Date.now(),
        }),
      );
    } catch (err) {
      console.error("Error fetching site data:", err);

      // Try to use cached data
      const cached = localStorage.getItem("siteData");
      if (cached) {
        const cachedData = JSON.parse(cached);
        setData({
          ...cachedData,
          loading: false,
          error: "Using cached data",
        });
      } else {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to load site data",
        }));
      }
    }
  };

  // Fetch on mount and setup polling
  useEffect(() => {
    fetchSiteData();

    // Poll for data changes every 30 seconds
    const interval = setInterval(fetchSiteData, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...data,
    refetch: fetchSiteData,
  };
};

/**
 * Hook to fetch specific data by type
 */
export const useFetchData = (endpoint, options = {}) => {
  const [state, setState] = useState({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(endpoint, options);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        setState({
          data: null,
          loading: false,
          error: err.message,
        });
      }
    };

    fetchData();
  }, [endpoint]);

  return state;
};

export default useSiteData;

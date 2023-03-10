// @ts-nocheck
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import { useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "../../../axiosInstance";
import { queryKeys } from "../../../react-query/constants";
import { useUser } from "../../user/hooks/useUser";
import { AppointmentDateMap } from "../types";
import { getAvailableAppointments } from "../utils";
import { getMonthYearDetails, getNewMonthYear, MonthYear } from "./monthYear";
import { useEffect } from "react";

// useQuery and prefetchQuery
const commonOptions = {
  staleTime: 0,
  cacheTime: 3 * 10000, // 5 minutes
};

async function getAppointments(
  year: string,
  month: string
): Promise<AppointmentDateMap> {
  const { data } = await axiosInstance.get(`/appointments/${year}/${month}`);
  return data;
}

interface UseAppointments {
  appointments: AppointmentDateMap;
  monthYear: MonthYear;
  updateMonthYear: (monthIncrement: number) => void;
  showAll: boolean;
  setShowAll: Dispatch<SetStateAction<boolean>>;
}

export function useAppointments(): UseAppointments {
  const currentMonthYear = getMonthYearDetails(dayjs());

  const [monthYear, setMonthYear] = useState(currentMonthYear);

  function updateMonthYear(monthIncrement: number): void {
    setMonthYear((prevData) => getNewMonthYear(prevData, monthIncrement));
  }
  const [showAll, setShowAll] = useState(false);
  const { user } = useUser();

  const selectFn = useCallback(
    (data) => getAvailableAppointments(data, user),
    [user]
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    const nextMonthYear = getNewMonthYear(monthYear, 1);
    queryClient.prefetchQuery(
      [queryKeys.appointments, nextMonthYear.year, nextMonthYear.month],
      () => getAppointements(nextMonthYear.year, nextMonthYear.month),
      commonOptions
    );
  }, [queryClient, monthYear]);

  const fallback = {};

  const { data: appointments = fallback } = useQuery(
    [queryKeys.appointments, monthYear.year, monthYear.month],
    () => getAppointments(monthYear.year, monthYear.month),
    {
      select: showAll ? undefined : selectFn,
      ...commonOptions,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: 60 * 1000,
    }
  );

  return { appointments, monthYear, updateMonthYear, showAll, setShowAll };
}

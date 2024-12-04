import {  useState } from "react"
import {DateTime} from "luxon"
import { doGetPrices } from "../../api/actions/doGetPrices"
import { Box, Button, Stack, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"

const today = DateTime.now()
const SEVEN_DAYS = new Array(7).fill(0)

export const RootContainer = () => {
    const [isoDate, setIsoDate] = useState(today.toISO() ?? "")
    const date = DateTime.fromISO(isoDate)
    const monday = date.set({ weekday: 1 })
    const sunday = date.set({ weekday: 7})


    const { data } = useQuery({ 
        queryKey: ["prices"],
        queryFn: doGetPrices,
        staleTime: 3000,
        select: ({ currency, prices }) => {
            const { last_run_pricing_time } = prices
            const parsed = SEVEN_DAYS.map((_, index) => {
                const nthDate = monday.plus({ days: index }) 
                const key =  nthDate.toFormat("yyyy-MM-dd")
                const lastUpdate = DateTime
                    .fromFormat(last_run_pricing_time, "yyyy-MM-dd HH:mm")
                    .toISO()

                return { 
                    key, 
                    prices: prices.data[key],
                    currency,
                    lastUpdate
            }
            }) 
            return parsed
        }
    }, )

    console.log({ data });
    
    
   



   

    const handlePrevious = () => {
        setIsoDate(date.minus({ days: 7 }).toISO())
    }

    const handleNext = () => {
        setIsoDate(date.plus({ days: 7 }).toISO())
    }
    return (
    <Stack>
        <Box component="nav">
            <Button onClick={handlePrevious}>Previous</Button>
            <Button onClick={handleNext}>Next</Button>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)">{SEVEN_DAYS.map((_, index) => {
            const nthDate = monday.plus({days: index})
            const formatted = nthDate.toFormat("yyyy-MM-dd")
            const label = nthDate.toFormat("EEE DD")
            const isWeekend = nthDate.weekday > 5
            return <Typography key={formatted} variant="body2">{label}</Typography>
        })}
        </Box>
    </Stack>)
}
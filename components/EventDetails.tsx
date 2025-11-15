import { notFound } from 'next/navigation'
import Image from 'next/image'
import BookEvent from '@/components/BookEvent'
import { IEvent } from '@/database/eventModel'
import { getSimilarEventsBySlug } from '@/lib/actions/eventActions'
import EventCard from '@/components/EventCard'
import { cacheLife } from 'next/cache'


const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const EventDetailItem = ({ icon, label, alt }: { icon: string, label: string, alt: string }) => (
  <div className={'flex-row-gap-2 items-center'}>
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
)

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => (
  <div className='agenda'>
    <h2>Agenda</h2>
    <ul>{agendaItems.map((item) => (
      <li key={item}>{item}</li>
    ))}
    </ul>
  </div>
)

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className='flex flex-row gap-1.5 flex-wrap'>
    {tags.map((tag) => (
      <div key={tag} className="pill">{tag}</div>
    ))

    }
  </div>
)
const EventDetailComponent = async ({ params }: { params: Promise<string> }) => {
  'use cache'
  cacheLife('minutes')

  const slug = await params
  const bookings = 10

  let event

  try {
    const response = await fetch(`${BASE_URL}/api/events/${slug}`)

    if (!response.ok) {
      if (response.status === 404) {
        return notFound()
      }

      throw new Error(`Failed to fetch event: ${response.statusText}`)
    }

    const data = await response.json()
    event = data.event
    if (!event) return notFound()

  } catch (error) {
    console.log({ error })
    return notFound()
  }

  const { title, description, image, overview, location, date, time, mode, agenda, audience, tags, organizer } = event

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug)

  return (
    <section id={'event'}>
      <div className={'header'}>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className={'details'}>
        {/*Left - Event content section*/}
        <div className={'content'}>
          <Image src={image} alt={title} width={800} height={400} className={'banner'} />

          <section className={'flex-col-gap-2'}>
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className={'flex-col-gap-2'}>
            <h2>Event Details</h2>

            <EventDetailItem icon={'/icons/calendar.svg'} alt={'calendar'} label={date} />
            <EventDetailItem icon={'/icons/clock.svg'} alt={'clock'} label={time} />
            <EventDetailItem icon={'/icons/pin.svg'} alt={'pin'} label={location} />
            <EventDetailItem icon={'/icons/mode.svg'} alt={'mode'} label={mode} />
            <EventDetailItem icon={'/icons/audience.svg'} alt={'audience'} label={audience} />
          </section>

          <EventAgenda agendaItems={agenda} />

          <section className='flex-col-gap-2'>
            <h2>About the organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/*Right - Booking form section*/}
        <aside className={'booking'}>
          <div className="signup-card">
            <h2>Book Your Spot</h2>

            {bookings > 0 ? (
              <p className='text-sm'>Join {bookings} people who have already booked their spot!</p>
            ) : (
              <p className='text-sm'>Be the first to book your spot!</p>
            )}

            <BookEvent eventId={event._id} slug={event.slug} />
          </div>
        </aside>
      </div>

      <div className='flex w-full flex-col gap-4 pt-20'>
        <h2>Similar Event</h2>

        <div className="events">
          {similarEvents.length > 0 && similarEvents.map((similarEvent) => (
            <EventCard key={similarEvent.slug} {...similarEvent} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventDetailComponent
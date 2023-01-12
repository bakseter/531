package net.bakseter.api.routes

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.Application
import io.ktor.server.application.call
import io.ktor.server.auth.authenticate
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.put
import io.ktor.server.routing.routing
import net.bakseter.api.schema.Workout
import net.bakseter.api.schema.WorkoutJson
import org.jetbrains.exposed.sql.and
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.select
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.update

fun Application.workoutRoutes() {
    routing {
        authenticate("auth-admin") {
            getWorkout()
            putWorkout()
        }
    }
}

fun Route.getWorkout() {
    get("/workout") {
        val cycle = call.request.queryParameters["cycle"]?.toIntOrNull()
        val week = call.request.queryParameters["week"]?.toIntOrNull()
        val day = call.request.queryParameters["day"]?.toIntOrNull()

        if (cycle == null || week == null || day == null) {
            call.respond(HttpStatusCode.BadRequest)
            return@get
        }

        val workout = transaction {
            Workout.select {
                Workout.cycle eq cycle and (Workout.week eq week and (Workout.day eq day))
            }.firstOrNull()
        }

        if (workout == null) {
            call.respond(HttpStatusCode.NotFound)
            return@get
        }

        call.respond(
            HttpStatusCode.OK,
            WorkoutJson(
                workout[Workout.cycle],
                workout[Workout.week],
                workout[Workout.day],
                workout[Workout.reps],
            )
        )
    }
}

fun Route.putWorkout() {
    put("/workout") {
        try {
            val workoutJson = call.receive<WorkoutJson>()

            val workout = transaction {
                Workout.select {
                    Workout.cycle eq workoutJson.cycle and (Workout.week eq workoutJson.week and (Workout.day eq workoutJson.day))
                }.firstOrNull()
            }

            if (workout == null) {
                transaction {
                    Workout.insert {
                        it[cycle] = workoutJson.cycle
                        it[week] = workoutJson.week
                        it[day] = workoutJson.day
                        it[reps] = workoutJson.reps
                    }
                }

                call.respond(HttpStatusCode.OK)
                return@put
            }

            transaction {
                Workout.update({ Workout.cycle eq workoutJson.cycle and (Workout.week eq workoutJson.week and (Workout.day eq workoutJson.day)) }) {
                    it[reps] = workoutJson.reps
                }
            }

            call.respond(HttpStatusCode.Accepted)
        } catch (e: Exception) {
            e.printStackTrace()
            call.respond(HttpStatusCode.InternalServerError)
        }
    }
}
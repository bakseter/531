package net.bakseter.api.schema

import kotlinx.serialization.Serializable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.jodatime.datetime
import org.joda.time.DateTime

@Serializable
data class WorkoutJson(
    val cycle: Int,
    val week: Int,
    val day: Int,
    val reps: Int,
)

@Serializable
data class DateJson(
    val date: String,
)

@Serializable
data class WorkoutCountJson(
    val count: Int,
)

val validWeeks = listOf(1, 2, 3)
val validDays = listOf(1, 2, 3, 4)
val validProfile = listOf(1, 2, 3, 4)

object Workout : Table("workout") {
    val email: Column<String> = text("email")
    val profile: Column<Int> = integer("profile").check("valid_profile") { it inList validProfile }
    val cycle: Column<Int> = integer("cycle")
    val week: Column<Int> = integer("week").check("valid_week") { it inList validWeeks }
    val day: Column<Int> = integer("day").check("valid_day") { it inList validDays }
    val reps: Column<Int> = integer("reps").default(0)
    val date: Column<DateTime?> = datetime("date").nullable()

    override val primaryKey: PrimaryKey = PrimaryKey(email, profile, cycle, week, day)
}
